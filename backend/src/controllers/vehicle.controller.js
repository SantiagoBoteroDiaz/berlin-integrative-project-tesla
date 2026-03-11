import { registerService, exitSession} from "../services/vehicle.service.js";

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