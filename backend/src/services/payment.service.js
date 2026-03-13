import { createPreference, getPayment } from '../sdk/mercadopago.js';
import { env } from '../config/env.js';
import { exitSession } from './vehicle.service.js';

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

const buildPreferencePayload = ({ plate, amount }, backUrls) => ({
  title: `Pago de salida - ${plate}`,
  quantity: 1,
  unitPrice: amount,
  externalReference: plate,
  metadata: {
    plate,
    amount
  },
  back_urls: backUrls,
  auto_return: 'approved'
});

const DEFAULT_BACK_URLS = {
  success: 'https://santiagoboterodiaz.github.io/berlin-integrative-project-tesla/frontend/src/pages/mercadopago/ticketSucces.html',
  pending: 'https://santiagoboterodiaz.github.io/berlin-integrative-project-tesla/frontend/src/pages/mercadopago/ticketPending.html',
  failure: 'https://santiagoboterodiaz.github.io/berlin-integrative-project-tesla/frontend/src/pages/mercadopago/ticketFailed.html'
};

export const createPaymentPreference = async (plate) => {
  const normalizedPlate = plate;
  const exitData = await fetchExitAmount(normalizedPlate);
  const backUrls = {
    success: env.MERCADOPAGO.BACK_URL_SUCCESS || DEFAULT_BACK_URLS.success,
    pending: env.MERCADOPAGO.BACK_URL_PENDING || DEFAULT_BACK_URLS.pending,
    failure: env.MERCADOPAGO.BACK_URL_FAILURE || DEFAULT_BACK_URLS.failure
  };
  const response = await createPreference(buildPreferencePayload(exitData, backUrls));
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

const extractPaymentData = (response) => response?.body ?? response;

const asNumber = (value) => {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : NaN;
};

export const confirmPaymentAndExit = async ({ paymentId, plate }) => {
  if (!paymentId) {
    throw new Error('paymentId es obligatorio para confirmar un pago.');
  }

  const paymentResponse = await getPayment(paymentId);
  const payment = extractPaymentData(paymentResponse);

  if (!payment?.id) {
    throw new Error('Mercado Pago no devolvió la información del pago.');
  }

  const resolvedPlate =
    plate || payment.external_reference || payment.metadata?.plate;
  if (!resolvedPlate) {
    throw new Error('No se pudo determinar la placa asociada al pago.');
  }

  const paidAmount = asNumber(payment.transaction_amount);
  const expectedAmount = asNumber(payment.metadata?.amount ?? paidAmount);
  if (!Number.isFinite(paidAmount)) {
    throw new Error('El monto del pago no es válido.');
  }
  if (Number.isFinite(expectedAmount)) {
    const difference = Math.abs(paidAmount - expectedAmount);
    if (difference >= 0.01) {
      throw new Error('El monto pagado no coincide con la preferencia esperada.');
    }
  }

  const basePaymentInfo = {
    id: payment.id,
    status: payment.status,
    statusDetail: payment.status_detail,
    transactionAmount: paidAmount,
    externalReference: payment.external_reference || resolvedPlate,
    metadata: payment.metadata
  };

  if (payment.status !== 'approved') {
    return {
      approved: false,
      payment: basePaymentInfo
    };
  }

  const exitResult = await exitSession(resolvedPlate);

  return {
    approved: true,
    payment: basePaymentInfo,
    exit: exitResult
  };
};
