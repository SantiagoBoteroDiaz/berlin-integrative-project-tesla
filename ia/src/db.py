"""db.py: lo mínimo para hablar con el backend (POST)."""

import os
import socket
import threading
from queue import Full, Queue
from urllib.parse import urlparse

import requests

DEFAULT_BACKEND_URL = "https://berlin-integrative-project-tesla-production.up.railway.app"
REGISTER_PATH = "/vehicle/register"
STATUS_PATH = "/vehicle/status"


def backend_reachable(backend_url, timeout_s=1):
    """True si el host/puerto responde (solo TCP, no HTTP)."""
    try:
        u = urlparse(backend_url)
        if not u.hostname:
            return False
        port = u.port or (443 if u.scheme == "https" else 80)
        with socket.create_connection((u.hostname, port), timeout=timeout_s):
            return True
    except Exception:
        return False


def map_type_vehicle(tipo):
    """Convierte 'carro'/'moto' a lo que espera el backend."""
    t = (tipo or "").strip().lower()
    if t in ("moto", "motorcycle", "bike"):
        return "motorcycle"
    return "car"


def build_url(backend_url, path):
    """
    backend_url puede ser:
    - 'https://...app/vehicle/register' (completo)
    """
    raw = (backend_url or DEFAULT_BACKEND_URL).strip().rstrip("/")
    u = urlparse(raw)
    base = f"{u.scheme}://{u.netloc}" if u.scheme and u.netloc else raw
    return base if base.endswith(path) else base + path


def post_json(url, payload, timeout_s=3):
    """POST simple. Retorna (ok, data, err)."""
    try:
        r = requests.post(url, json=payload, timeout=timeout_s)
        if r.status_code >= 400:
            return False, None, f"HTTP {r.status_code}: {r.text[:200]}"
        try:
            return True, r.json(), None
        except Exception:
            return True, (r.text or "ok"), None
    except Exception as e:
        return False, None, str(e)


def register_vehicle(backend_url, plate, type_vehicle, timeout_s=3):
    """POST /vehicle/register con {plate, typeVehicle}. Retorna (ok, err)."""
    url = build_url(backend_url, REGISTER_PATH)
    ok, data, err = post_json(url, {"plate": plate, "typeVehicle": type_vehicle}, timeout_s=timeout_s)
    verbose_ok = os.environ.get("PRINT_API_OK", "1") == "1"
    if ok and verbose_ok:
        preview = data if isinstance(data, (dict, list)) else str(data)
        print(f"[API] Registro exitoso plate={plate} typeVehicle={type_vehicle} resp={str(preview)[:200]}")
    return ok, err


def get_vehicle_status(backend_url, plate, timeout_s=3):
    """POST /vehicle/status con {plate}. Retorna (ok, data, err)."""
    url = build_url(backend_url, STATUS_PATH)
    return post_json(url, {"plate": plate}, timeout_s=timeout_s)


class BackgroundVehicleSender:
    """Un hilo que manda los POST para no frenar el video."""

    _STOP = object()

    def __init__(self, backend_url, timeout_s=3, max_queue=256):
        self.backend_url = backend_url
        self.timeout_s = timeout_s
        self.q = Queue(maxsize=max_queue)
        self.t = threading.Thread(target=self._run, daemon=True)
        self.started = False

    def start(self):
        if self.started:
            return
        self.started = True
        self.t.start()

    def submit(self, plate, type_vehicle):
        """Encola. Si la cola está llena retorna False."""
        try:
            self.q.put_nowait((plate, type_vehicle))
            return True
        except Full:
            return False

    def close(self, join_timeout_s=2):
        if not self.started:
            return
        try:
            self.q.put(self._STOP, timeout=0.2)
        except Full:
            pass
        self.t.join(timeout=join_timeout_s)

    def _run(self):
        while True:
            item = self.q.get()
            if item is self._STOP:
                return
            plate, type_vehicle = item
            max_retries = int(os.environ.get("BG_SEND_MAX_RETRIES", "5"))
            retry_sleep_s = float(os.environ.get("BG_SEND_RETRY_SLEEP_S", "1"))
            last_err = None

            for attempt in range(max_retries):
                ok, err = register_vehicle(self.backend_url, plate, type_vehicle, timeout_s=self.timeout_s)
                if ok:
                    last_err = None
                    break

                last_err = err
                if err and "unique_active_session" in err:
                    break
                if attempt < max_retries - 1:
                    try:
                        import time

                        time.sleep(retry_sleep_s)
                    except Exception:
                        break

            if last_err:
                print(f"[API] No se pudo registrar {plate}: {last_err}")
