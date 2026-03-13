import { registerService, exitSession, allHourlyRate, allSuscription, registerNew, registNewVehiclePlan } from "../services/vehicle.service.js";
import { createPaymentPreference } from "../services/payment.service.js";

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