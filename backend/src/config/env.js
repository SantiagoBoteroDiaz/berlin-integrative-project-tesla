import 'dotenv/config';

// Centralized configuration object that exposes environment-derived variables.
export const env = {
  APP_PORT: process.env.APP_PORT,
  DB: {
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME
  },
  // Mercado Pago credentials required for payment SDK operations.
  MERCADOPAGO: {
    ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
    PUBLIC_KEY: process.env.MP_PUBLIC_KEY,
    BACK_URL_SUCCESS: process.env.MP_BACK_URL_SUCCESS,
    BACK_URL_PENDING: process.env.MP_BACK_URL_PENDING,
    BACK_URL_FAILURE: process.env.MP_BACK_URL_FAILURE
  }
};
