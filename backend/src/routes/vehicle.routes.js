import { Router } from "express";
import { proccessRegister, exitRegister, hourlyRate, suscription, registNew } from "../controllers/vehicle.controller.js";

const vehicleRoutes = Router();

// Only POST requests are allowed for vehicle registration workflow. 

vehicleRoutes.post('/register', proccessRegister);
vehicleRoutes.post('/exit', exitRegister);
vehicleRoutes.get('/hourlyRate', hourlyRate); 
vehicleRoutes.get('/suscription', suscription); 
vehicleRoutes.post('/newVehicle' , registNew);   

export default vehicleRoutes;
