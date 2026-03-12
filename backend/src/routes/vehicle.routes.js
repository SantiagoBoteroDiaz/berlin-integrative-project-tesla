import { Router } from "express";
import { proccessRegister, exitRegister, createPaymentLink, hourlyRate, suscription , registNew} from "../controllers/vehicle.controller.js";

const vehicleRoutes = Router();

// Only POST requests are allowed for vehicle registration workflow. 

vehicleRoutes.post('/register', proccessRegister);
vehicleRoutes.post('/exit', exitRegister);
vehicleRoutes.post('/payment', createPaymentLink);
vehicleRoutes.get('/hourlyRate', hourlyRate); 
vehicleRoutes.get('/suscription', suscription); 
vehicleRoutes.post('/newVehicle' , registNew);   
vehicleRoutes.get('/suscription', suscription);

export default vehicleRoutes;
