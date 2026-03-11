import { registerService } from "../services/registerVehicle.service.js";

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
