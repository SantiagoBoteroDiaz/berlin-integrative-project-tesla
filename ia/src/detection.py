import re
from dataclasses import dataclass, field

import cv2

try:
    from .config import (
        BASE_DIR,
        YOLO_CONF,
        YOLO_IOU,
        MIN_OCR_CONF,
        MIN_VOTOS_PARA_VALIDAR,
        MIN_CONSECUTIVOS_PARA_VALIDAR,
        IOU_UMBRAL_ASOCIACION,
        MAX_FRAMES_SIN_VER,
        PADDING_FRAC,
        MIN_ASPECT,
        MAX_ASPECT,
        MIN_AREA_FRAC,
        MAX_AREA_FRAC,
        DEBUG_SAVE_CROPS,
        CARRO_REGEX,
        MOTO_REGEX,
        Flags,
    )
    from .db import map_type_vehicle, register_vehicle
    from .ocr_utils import leer_texto
except ImportError:
    from config import (
        BASE_DIR,
        YOLO_CONF,
        YOLO_IOU,
        MIN_OCR_CONF,
        MIN_VOTOS_PARA_VALIDAR,
        MIN_CONSECUTIVOS_PARA_VALIDAR,
        IOU_UMBRAL_ASOCIACION,
        MAX_FRAMES_SIN_VER,
        PADDING_FRAC,
        MIN_ASPECT,
        MAX_ASPECT,
        MIN_AREA_FRAC,
        MAX_AREA_FRAC,
        DEBUG_SAVE_CROPS,
        CARRO_REGEX,
        MOTO_REGEX,
        Flags,
    )
    from db import map_type_vehicle, register_vehicle
    from ocr_utils import leer_texto


@dataclass
class DetectionState:
    placas_validadas: set = field(default_factory=set)
    placas_tipo: dict = field(default_factory=dict)  # placa -> "carro" | "moto"
    placas_enviadas: set = field(default_factory=set)
    tracks: dict = field(default_factory=dict)  # id -> track data
    next_track_id: int = 1
    frame_idx: int = 0


def _clamp_bbox(x1: int, y1: int, x2: int, y2: int, w: int, h: int):
    """Recorta un bounding box a los límites de la imagen; devuelve None si queda vacío."""
    x1 = max(0, min(x1, w - 1))
    y1 = max(0, min(y1, h - 1))
    x2 = max(0, min(x2, w))
    y2 = max(0, min(y2, h))
    if x2 <= x1 or y2 <= y1:
        return None
    return x1, y1, x2, y2


def _iou(a, b) -> float:
    """Calcula Intersection-over-Union entre dos cajas (x1,y1,x2,y2)."""
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b
    ix1, iy1 = max(ax1, bx1), max(ay1, by1)
    ix2, iy2 = min(ax2, bx2), min(ay2, by2)
    iw, ih = max(0, ix2 - ix1), max(0, iy2 - iy1)
    inter = iw * ih
    if inter <= 0:
        return 0.0
    area_a = (ax2 - ax1) * (ay2 - ay1)
    area_b = (bx2 - bx1) * (by2 - by1)
    denom = area_a + area_b - inter
    return float(inter / denom) if denom > 0 else 0.0


def _draw_annotations(frame, x1, y1, x2, y2, validated, placas_tipo):
    """Dibuja el recuadro y, si está validada, la etiqueta con la placa/tipo."""
    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
    if validated:
        cv2.rectangle(frame, (x1, y1 - 30), (x2, y1), (0, 255, 0), -1)
        tipo = placas_tipo.get(validated)
        label = f"{validated} ({tipo})" if tipo else validated
        cv2.putText(
            frame,
            label,
            (x1 + 5, y1 - 8),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.9,
            (0, 0, 0),
            2,
        )


def _send_plate(best, type_vehicle, state: DetectionState, sender, flags: Flags):
    """Envía la placa al backend (en hilo o directo) y marca como enviada si fue OK."""
    if not flags.send_to_db or best in state.placas_enviadas:
        return

    sent = False
    if sender is not None:
        sent = sender.submit(best, type_vehicle)
        if not sent:
            ok, err = register_vehicle(flags.backend_url, best, type_vehicle)
            sent = ok
            if not ok:
                print(f"[API] No se pudo registrar {best}: {err}")
    else:
        ok, err = register_vehicle(flags.backend_url, best, type_vehicle)
        sent = ok
        if not ok:
            print(f"[API] No se pudo registrar {best}: {err}")

    if sent:
        state.placas_enviadas.add(best)


def process_frame(frame, model, state: DetectionState, sender, flags: Flags):
    """Procesa un frame: detecta, valida placas, dibuja y dispara el envío."""
    results = model(frame, conf=YOLO_CONF, iou=YOLO_IOU, verbose=False)

    for r in results:
        boxes = r.boxes.xyxy
        confs = r.boxes.conf if hasattr(r.boxes, "conf") else None
        it = zip(boxes, confs) if confs is not None else ((b, None) for b in boxes)
        for box, conf_det in it:
            if conf_det is not None and float(conf_det) < YOLO_CONF:
                continue

            x1, y1, x2, y2 = map(int, box.cpu().numpy())
            clamped = _clamp_bbox(x1, y1, x2, y2, frame.shape[1], frame.shape[0])
            if clamped is None:
                continue
            x1, y1, x2, y2 = clamped

            bw, bh = (x2 - x1), (y2 - y1)
            if bh <= 0 or bw <= 0:
                continue
            aspect = bw / bh
            if aspect < MIN_ASPECT or aspect > MAX_ASPECT:
                continue
            area_frac = (bw * bh) / float(frame.shape[0] * frame.shape[1])
            if area_frac < MIN_AREA_FRAC or area_frac > MAX_AREA_FRAC:
                continue

            # Padding alrededor de la placa para que no quede "cortada"
            pad_x = int(bw * PADDING_FRAC)
            pad_y = int(bh * PADDING_FRAC)
            padded = _clamp_bbox(x1 - pad_x, y1 - pad_y, x2 + pad_x, y2 + pad_y, frame.shape[1], frame.shape[0])
            if padded is None:
                continue
            px1, py1, px2, py2 = padded

            # Asociar detección a un track existente (para "validar" a través de frames)
            mejor_id = None
            mejor_iou = 0.0
            for tid, t in state.tracks.items():
                i = _iou((x1, y1, x2, y2), t["bbox"])
                if i > mejor_iou:
                    mejor_iou = i
                    mejor_id = tid

            if mejor_id is None or mejor_iou < IOU_UMBRAL_ASOCIACION:
                tid = state.next_track_id
                state.next_track_id += 1
                state.tracks[tid] = {"bbox": (x1, y1, x2, y2), "last_seen": state.frame_idx, "votes": {}, "best": None}
            else:
                tid = mejor_id
                state.tracks[tid]["bbox"] = (x1, y1, x2, y2)
                state.tracks[tid]["last_seen"] = state.frame_idx

            if "validated" not in state.tracks[tid]:
                state.tracks[tid]["validated"] = None
                state.tracks[tid]["last_text"] = None
                state.tracks[tid]["consecutive"] = 0

            texto = None
            conf_ocr = 0.0
            if state.tracks[tid]["validated"] is None:
                plate = frame[py1:py2, px1:px2]
                texto, conf_ocr, _ = leer_texto(plate)
                if DEBUG_SAVE_CROPS and (texto or (conf_det is not None and float(conf_det) >= YOLO_CONF + 0.15)):
                    debug_dir = BASE_DIR / "debug_crops"
                    debug_dir.mkdir(parents=True, exist_ok=True)
                    fname = debug_dir / f"f{state.frame_idx:06d}_t{tid}_d{float(conf_det or 0):.2f}_o{conf_ocr:.2f}.jpg"
                    cv2.imwrite(fname, plate)

            # Votación por track (más robusto que comparar prev_frame con el mismo bbox)
            if texto and conf_ocr >= MIN_OCR_CONF and state.tracks[tid]["validated"] is None:
                votos = state.tracks[tid]["votes"]
                votos[texto] = votos.get(texto, 0) + 1
                state.tracks[tid]["best"] = max(votos, key=votos.get)

                if state.tracks[tid]["last_text"] == texto:
                    state.tracks[tid]["consecutive"] += 1
                else:
                    state.tracks[tid]["last_text"] = texto
                    state.tracks[tid]["consecutive"] = 1

            best = state.tracks[tid]["best"]
            if (
                state.tracks[tid]["validated"] is None
                and best
                and state.tracks[tid]["votes"].get(best, 0) >= MIN_VOTOS_PARA_VALIDAR
                and state.tracks[tid]["consecutive"] >= MIN_CONSECUTIVOS_PARA_VALIDAR
            ):
                state.tracks[tid]["validated"] = best
                state.placas_validadas.add(best)  # Agrega solo si es nueva
                if re.match(CARRO_REGEX, best):
                    state.placas_tipo[best] = "carro"
                elif re.match(MOTO_REGEX, best):
                    state.placas_tipo[best] = "moto"
                else:
                    state.placas_tipo[best] = "desconocido"

                type_vehicle = map_type_vehicle(state.placas_tipo.get(best))
                if flags.print_each_plate:
                    print({"plate": best, "typeVehicle": type_vehicle})

                _send_plate(best, type_vehicle, state, sender, flags)

            validated = state.tracks[tid]["validated"]
            if validated or texto:
                _draw_annotations(frame, x1, y1, x2, y2, validated, state.placas_tipo)

    # Limpieza de tracks viejos (placas que ya no están en escena)
    to_delete = [tid for tid, t in state.tracks.items() if state.frame_idx - t["last_seen"] > MAX_FRAMES_SIN_VER]
    for tid in to_delete:
        del state.tracks[tid]

    state.frame_idx += 1
