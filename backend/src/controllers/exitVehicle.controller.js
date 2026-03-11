import { exitSession } from "../services/exitVehicles.service.js";

// HTTP controller that orchestrates validation and service execution for vehicle entry.
export const exitRegister = async (req, res) => {
    try {
        const { plate } = req.body;
        const result = await exitSession(plate);
        res.json({ response: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
