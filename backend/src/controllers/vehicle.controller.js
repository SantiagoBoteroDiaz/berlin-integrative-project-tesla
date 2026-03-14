import { registerService, exitSession, allHourlyRate, allSuscription, registerNew, registNewVehiclePlan, paymentExit } from "../services/vehicle.service.js";
import { createPaymentPreference, confirmPaymentAndExit, createSubscriptionPreference } from "../services/payment.service.js";

// HTTP controller that orchestrates validation and service execution for vehicle entry.
export const proccessRegister = async (req, res) => {
    try {
        const { plate, typeVehicle } = req.body;
        const result = await registerService(plate, typeVehicle);
        res.json({ response: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const exitRegister = async (req, res) => {
    try {
        const { plate } = req.body;
        const result = await exitSession(plate);
        res.json({ response: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPaymentLink = async (req, res) => {
    try {
        const { plate } = req.body;
        const result = await createPaymentPreference(plate);
        res.json({ response: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createSubscriptionPayment = async (req, res) => {
    try {
        const { plate, planType, amount } = req.body;
        const result = await createSubscriptionPreference({ plate, planType, amount });
        res.json({ response: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const confirmPayment = async (req, res) => {
    try {
        const { paymentId, plate } = req.body;
        const result = await confirmPaymentAndExit({ paymentId, plate });
        res.json({ response: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const FRONTEND_BASE = 'https://berlin-integrative-project-tesla-production.up.railway.app/'.replace(/\/$/, '');

const buildFrontendRedirect = ({ status, plate, paymentId, message }) => {
    try {
        const redirectUrl = new URL(FRONTEND_BASE);
        redirectUrl.searchParams.set('paymentStatus', status);
        if (plate) redirectUrl.searchParams.set('plate', plate);
        if (paymentId) redirectUrl.searchParams.set('paymentId', paymentId);
        if (message) redirectUrl.searchParams.set('message', message);
        return redirectUrl.toString();
    } catch {
        const params = new URLSearchParams({ paymentStatus: status });
        if (plate) params.set('plate', plate);
        if (paymentId) params.set('paymentId', paymentId);
        if (message) params.set('message', message);
        return `${FRONTEND_BASE}?${params.toString()}`;
    }
};

export const handlePaymentCallback = async (req, res) => {
    const paymentId = req.query.payment_id ?? req.query.collection_id;
    const plate = req.query.external_reference ?? req.query.plate;

    if (!paymentId) {
        const url = buildFrontendRedirect({
            status: 'error',
            plate,
            message: 'payment_id missing in Mercado Pago response'
        });
        return res.redirect(url);
    }

    try {
        const result = await confirmPaymentAndExit({ paymentId, plate });
        const url = buildFrontendRedirect({
            status: result.approved ? 'approved' : 'not-approved',
            plate: result.payment.externalReference,
            paymentId: result.payment.id
        });
        return res.redirect(url);
    } catch (error) {
        const url = buildFrontendRedirect({
            status: 'error',
            plate,
            message: error.message
        });
        return res.redirect(url);
    }
};

export const hourlyRate = async (req, res) => {
    try {
        const result = await allHourlyRate();
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const suscription = async (req, res) => {
    try {
        const result = await allSuscription();
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const registNew = async (req , res ) => {
    try { 
        const {plate, typeVehicle} = req.body  
        const response = await registerNew(plate, typeVehicle); 
        res.json(response)
    }catch (error) {
        res.status(500).json({reponse : "Error in register vehicle"})
    }
} 

export const registPlan = async (req, res) => {
    try {
        const { plate, planType, amount, status, idMercadoPago } = req.body;   
        const response = await registNewVehiclePlan(plate, planType, amount, status, idMercadoPago);
        res.json(response);
    } catch (error) {
        res.status(500).json({ response: error });
    }   
}

export const registExitAndPayment = async(req, res) => {
    try {
        const {plate, idMercadoPago, amount, status} = req.body 
        const response = await paymentExit(plate, idMercadoPago, amount, status) 
        res.json(response)
    } catch (error) {
        res.status(500).json({response: error})
    }
}
