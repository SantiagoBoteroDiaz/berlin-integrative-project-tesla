from dataclasses import dataclass
import os
from pathlib import Path

# Rutas base para los recursos de IA
BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BASE_DIR / "Model" / "modeloIA.pt"
VIDEO_PATH = BASE_DIR / "data" / "car.mp4"
# Salida del video anotado (usa .avi para máxima compatibilidad por defecto)
# Ruta del video anotado (solo si se habilita guardado)
OUTPUT_VIDEO_PATH = BASE_DIR / "data" / "car_detected.avi"

# Umbrales y parámetros de detección/OCR
YOLO_CONF = 0.25  # Subir si hay falsos positivos; bajar si se pierden placas
YOLO_IOU = 0.5
MIN_OCR_CONF = 0.45
MIN_VOTOS_PARA_VALIDAR = 3
MIN_CONSECUTIVOS_PARA_VALIDAR = 2
IOU_UMBRAL_ASOCIACION = 0.3
MAX_FRAMES_SIN_VER = 30
PADDING_FRAC = 0.12

# Filtros geométricos para reducir falsos positivos
MIN_ASPECT = 1.3
MAX_ASPECT = 7.0
MIN_AREA_FRAC = 0.0008
MAX_AREA_FRAC = 0.08

DEBUG_SAVE_CROPS = False  # Si pones True, guarda recortes en ./debug_crops/
PRINT_TIPOS = True

CARRO_REGEX = r"^[A-Z]{3}[0-9]{3}$"
MOTO_REGEX = r"^[A-Z]{3}[0-9]{2}[A-Z]$"  # Ajusta si tu formato de moto es diferente


@dataclass
class Flags:
    send_to_db: bool
    backend_url: str
    bg_send: bool
    bg_send_max_queue: int
    headless: bool
    show_video: bool
    save_video: bool
    output_video_path: Path
    print_each_plate: bool


def load_flags(default_backend: str) -> Flags:
    """Carga banderas de ejecución desde variables de entorno.

    default_backend se usa como URL por defecto si BACKEND_URL no está definido.
    """
    send_to_db = os.environ.get("SEND_TO_DB", "1") == "1"
    backend_url = os.environ.get("BACKEND_URL", default_backend)
    bg_send = os.environ.get("BG_SEND", "1") == "1"
    try:
        bg_send_max_queue = int(os.environ.get("BG_SEND_MAX_QUEUE", "256"))
    except ValueError:
        bg_send_max_queue = 256
    headless = os.environ.get("HEADLESS", "0") == "1"
    # Por defecto mostrar el video; se puede desactivar con SHOW_VIDEO=0 o en entornos headless
    show_video = os.environ.get("SHOW_VIDEO", "1") == "1" and not headless
    # Por defecto NO guardamos video; se activa con SAVE_VIDEO=1
    save_video = os.environ.get("SAVE_VIDEO", "0") == "1"
    output_video_path = Path(os.environ.get("OUTPUT_VIDEO_PATH", OUTPUT_VIDEO_PATH))
    print_each_plate = os.environ.get("PRINT_EACH_PLATE", "1") == "1"
    return Flags(
        send_to_db=send_to_db,
        backend_url=backend_url,
        bg_send=bg_send,
        bg_send_max_queue=bg_send_max_queue,
        headless=headless,
        show_video=show_video,
        save_video=save_video,
        output_video_path=output_video_path,
        print_each_plate=print_each_plate,
    )
