import { Router } from "express";
import { exitRegister  } from "../controllers/exitVehicle.controller.js";

const exitRegisterRoutes = Router();

// Only POST requests are allowed for vehicle registration workflow.
exitRegisterRoutes.post('/', exitRegister);

export default exitRegisterRoutes;
 