import { Router } from "express";
import { proccessRegister, exitRegister } from "../controllers/vehicle.controller.js";

const vehicleRoutes = Router();

// Only POST requests are allowed for vehicle registration workflow.
vehicleRoutes.post('/register', proccessRegister);
vehicleRoutes.post('/exit', exitRegister);

export default vehicleRoutes;
