import cv2
import easyocr
import numpy as np
import re

from .config import MIN_OCR_CONF, CARRO_REGEX, MOTO_REGEX

# Lector OCR cargado una sola vez
_reader = easyocr.Reader(["en"])


def leer_texto(img):
    """Lee un recorte de placa con OCR y normaliza a formato de matrícula.

    Retorna una tupla (texto, confianza, tipo_estimado) donde:
    - texto: string de la placa si se reconoció, sino None
    - confianza: probabilidad (0-1) devuelta por EasyOCR para ese texto
    - tipo_estimado: 'carro', 'moto' o None según el patrón detectado
    """
    if img is None or img.size == 0:
        return None, 0.0, None

    h, w = img.shape[:2]
    if w < 240:
        scale = max(2, int(np.ceil(240 / max(1, w))))
        img = cv2.resize(img, (w * scale, h * scale), interpolation=cv2.INTER_CUBIC)

    # Normalización de confusiones típicas de OCR en placas
    digit_to_letter = {"0": "O", "1": "I", "2": "Z", "5": "S", "8": "B"}
    letter_to_digit = {"O": "0", "I": "1", "Z": "2", "S": "5", "B": "8", "G": "6", "T": "7"}

    def normalizar_placa(raw: str):
        s = re.sub(r"[^A-Z0-9]", "", raw.upper())
        if len(s) < 6 or len(s) > 8:
            return []
        subs = [s] if len(s) == 6 else [s[i : i + 6] for i in range(len(s) - 5)]
        out = []  # [(placa, tipo), ...]
        for sub in subs:
            a = sub[:3]
            tail = sub[3:]

            # Carro: LLL DDD
            a_car = "".join(digit_to_letter.get(ch, ch) for ch in a)
            b_car = "".join(letter_to_digit.get(ch, ch) for ch in tail)
            cand_car = a_car + b_car
            if re.match(CARRO_REGEX, cand_car):
                out.append((cand_car, "carro"))

            # Moto (común): LLL DD L
            b2 = tail[:2]
            c1 = tail[2:]
            b_moto = "".join(letter_to_digit.get(ch, ch) for ch in b2)
            c_moto = "".join(digit_to_letter.get(ch, ch) for ch in c1)
            cand_moto = a_car + b_moto + c_moto
            if re.match(MOTO_REGEX, cand_moto):
                out.append((cand_moto, "moto"))
        return out

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)
    gray = cv2.bilateralFilter(gray, 9, 75, 75)
    _, th = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    th_inv = cv2.bitwise_not(th)

    def _ocr(img2):
        # EasyOCR funciona bien con RGB; también acepta escala de grises
        if len(img2.shape) == 2:
            rgb2 = cv2.cvtColor(img2, cv2.COLOR_GRAY2RGB)
        else:
            rgb2 = cv2.cvtColor(img2, cv2.COLOR_BGR2RGB)
        return _reader.readtext(
            rgb2,
            allowlist="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            decoder="beamsearch",
            text_threshold=0.6,
            low_text=0.3,
            contrast_ths=0.1,
            adjust_contrast=0.7,
            paragraph=False,
        )

    # Probamos dos preprocesados para mejorar lectura en diferentes iluminaciones
    resultados = _ocr(img) + _ocr(th) + _ocr(th_inv)

    mejor_texto = None
    mejor_conf = 0.0
    mejor_tipo = None
    for _, texto, conf in resultados:
        if conf < MIN_OCR_CONF:
            continue
        candidatos = normalizar_placa(texto)
        for cand, tipo in candidatos:
            if conf > mejor_conf:
                mejor_texto = cand
                mejor_conf = float(conf)
                mejor_tipo = tipo

    return mejor_texto, mejor_conf, mejor_tipo
