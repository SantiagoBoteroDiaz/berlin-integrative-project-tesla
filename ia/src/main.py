import cv2
import time
from pathlib import Path
from ultralytics import YOLO

try:
    from .db import DEFAULT_BACKEND_URL, BackgroundVehicleSender, backend_reachable
    from .config import BASE_DIR, MODEL_PATH, VIDEO_PATH, load_flags, Flags
    from .detection import DetectionState, process_frame
except ImportError:
    from db import DEFAULT_BACKEND_URL, BackgroundVehicleSender, backend_reachable
    from config import BASE_DIR, MODEL_PATH, VIDEO_PATH, load_flags, Flags
    from detection import DetectionState, process_frame


def ensure_assets():
    """Verifica que el modelo y el video de entrada existan antes de correr."""
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"No se encontró el modelo en: {MODEL_PATH}")
    if not VIDEO_PATH.exists():
        raise FileNotFoundError(f"No se encontró el video en: {VIDEO_PATH}")


def build_model():
    """Carga el modelo YOLO desde disco."""
    return YOLO(str(MODEL_PATH))


def open_video():
    """Abre el video de entrada y devuelve el capturador."""
    return cv2.VideoCapture(str(VIDEO_PATH))


def _select_fourcc_and_path(output_path: Path):
    """Elige códec según la extensión; usa MJPG para máxima compatibilidad en AVI."""
    ext = output_path.suffix.lower()
    if ext == ".avi":
        return cv2.VideoWriter_fourcc(*"MJPG"), output_path
    if ext == ".mp4":
        return cv2.VideoWriter_fourcc(*"mp4v"), output_path
    # fallback genérico
    return cv2.VideoWriter_fourcc(*"MJPG"), output_path.with_suffix(".avi")


def _prepare_output_path(path: Path) -> Path:
    """Intenta limpiar el archivo previo; si está bloqueado, genera un nombre alterno."""
    if path.exists():
        try:
            path.unlink()
        except OSError:
            # Recurso ocupado, crea nuevo nombre con timestamp
            ts = int(time.time())
            alt = path.with_name(f"{path.stem}_{ts}{path.suffix}")
            print(f"[VIDEO] {path.name} está en uso, guardando como {alt.name}")
            path = alt
    return path


def build_writer(cap, flags: Flags, first_frame):
    """Prepara el VideoWriter para guardar el video anotado usando tamaño real del frame."""
    if not flags.save_video:
        return None

    flags.output_video_path.parent.mkdir(parents=True, exist_ok=True)
    flags.output_video_path = _prepare_output_path(flags.output_video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps is None or fps <= 0:
        fps = 30.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Algunos contenedores no reportan w/h hasta leer el primer frame
    if w <= 0 or h <= 0:
        h, w = first_frame.shape[:2]

    fourcc, path = _select_fourcc_and_path(flags.output_video_path)
    writer = cv2.VideoWriter(str(path), fourcc, fps, (w, h), True)
    if not writer.isOpened():
        # Intentar fallback a AVI/XVID
        if path.suffix.lower() != ".avi":
            alt_path = path.with_suffix(".avi")
            fourcc = cv2.VideoWriter_fourcc(*"XVID")
            writer = cv2.VideoWriter(str(alt_path), fourcc, fps, (w, h), True)
            if writer.isOpened():
                print(f"[VIDEO] Fallback a {alt_path}")
                flags.output_video_path = alt_path
                return writer
        raise RuntimeError(f"No se pudo crear el archivo de salida: {path}")

    flags.output_video_path = path
    return writer


def start_sender(flags: Flags):
    """Crea el sender en segundo plano si las banderas lo habilitan."""
    if not flags.send_to_db or not flags.bg_send:
        return None
    sender = BackgroundVehicleSender(flags.backend_url, max_queue=flags.bg_send_max_queue)
    sender.start()
    return sender


def main():
    ensure_assets()

    flags = load_flags(DEFAULT_BACKEND_URL)
    if flags.send_to_db and not backend_reachable(flags.backend_url):
        print(f"[API] Backend no disponible: {flags.backend_url} (igual se intentará enviar cuando sea posible)")

    model = build_model()
    cap = open_video()
    sender = start_sender(flags)
    state = DetectionState()

    ret, frame = cap.read()
    if not ret:
        cap.release()
        if sender is not None:
            sender.close()
        raise RuntimeError("Error al abrir el video")

    writer = build_writer(cap, flags, frame)

    while True:
        process_frame(frame, model, state, sender, flags)

        if writer is not None:
            writer.write(frame)

        if flags.show_video:
            cv2.imshow("Detector", frame)
            if cv2.waitKey(30) == 27:  # Esc para salir
                break

        ret, frame = cap.read()
        if not ret:
            break

    cap.release()
    if writer is not None:
        writer.release()
    cv2.destroyAllWindows()
    if sender is not None:
        sender.close()


if __name__ == "__main__":
    main()
