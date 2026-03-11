import { Router } from "express";
import { proccessRegister } from "../controllers/registerVehicle.controller.js";

const registerVehicleRoutes = Router();

// Only POST requests are allowed for vehicle registration workflow.
registerVehicleRoutes.post('/', proccessRegister);

export default registerVehicleRoutes;
