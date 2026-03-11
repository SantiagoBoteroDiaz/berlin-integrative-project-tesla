import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { env } from './config/env.js';

// This module encapsulates Mercado Pago SDK integration.
// It creates payment preferences and fetches payment details.

const accessToken = String(env.MERCADOPAGO.ACCESS_TOKEN || '').trim();
if (!accessToken) {
  throw new Error('Missing MP_ACCESS_TOKEN environment variable');
}

const client = new MercadoPagoConfig({ accessToken });
const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

// Creates a preference and returns checkout links for the frontend.
export async function createPreference({
  title,
  quantity,
  unitPrice,
  externalReference,
  metadata
}) {
  try {
    // Build a minimal valid Mercado Pago payload.
    const body = {
      items: [
        {
          title,
          quantity,
          unit_price: unitPrice,
          currency_id: 'COP'
        }
      ],
      external_reference: externalReference,
      metadata
    };

    const response = await preferenceClient.create({ body });
    return response;
  } catch (error) {
    console.error('[MercadoPago] Error al crear preferencia:', error);
    throw error;
  }
}

// Retrieves payment detail by payment id.
export async function getPayment(paymentId) {
  try {
    return await paymentClient.get({ id: paymentId });
  } catch (error) {
    console.error(`[MercadoPago] Error al consultar pago ${paymentId}:`, error);
    throw error;
  }
}
