import { createPreference } from '../sdk/mercadopago.js';
import { env } from '../config/env.js';

const DEFAULT_EXIT_API_URL =
  'https://berlin-integrative-project-tesla-production.up.railway.app/vehicle/exit/';
const EXIT_API_URL = env.EXIT_API_URL || DEFAULT_EXIT_API_URL;

const normalizeAmount = (raw) => {
  if (typeof raw === 'string') {
    const cleaned = raw.replace(/[^0-9.-]+/g, '');
    if (cleaned === '') return NaN;
    return Number(cleaned);
  }

  return Number(raw);
};

const fetchExitAmount = async (plate) => {
  const response = await fetch(EXIT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ plate })
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    const detail = payload?.message || payload?.error || `status ${response.status}`;
    throw new Error(`La API de salida devolvió un error: ${detail}`);
  }

  const normalizedPayload = payload?.response ?? payload;
  const amount = normalizeAmount(normalizedPayload?.amount);
  if (!Number.isFinite(amount)) {
    throw new Error('La API de salida respondió con un monto inválido.');
  }

  return {
    plate: normalizedPayload?.plate ?? plate,
    amount
  };
};

const buildPreferencePayload = ({ plate, amount }) => ({
  title: `Pago de salida - ${plate}`,
  quantity: 1,
  unitPrice: amount,
  externalReference: plate,
  metadata: {
    plate,
    amount
  }
});

export const createPaymentPreference = async (plate) => {
  const normalizedPlate = plate;
  const exitData = await fetchExitAmount(normalizedPlate);
  const response = await createPreference(buildPreferencePayload(exitData));
  const body = response?.body ?? response;
  const initPoint = body?.init_point ?? body?.sandbox_init_point;

  if (!initPoint) {
    throw new Error('Mercado Pago no devolvió un enlace de pago válido.');
  }

  return {
    plate: exitData.plate,
    amount: exitData.amount,
    preferenceId: body?.id,
    initPoint,
    sandboxInitPoint: body?.sandbox_init_point
  };
};
