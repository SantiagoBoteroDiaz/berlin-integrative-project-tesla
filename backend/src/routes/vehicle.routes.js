import { Router } from "express";
import { proccessRegister, exitRegister, createPaymentLink, hourlyRate, suscription , registNew, registPlan, registExitAndPayment } from "../controllers/vehicle.controller.js";
import { confirmPayment, handlePaymentCallback } from "../controllers/vehicle.controller.js"; 
const vehicleRoutes = Router();

// Only POST requests are allowed for vehicle registration workflow. 

vehicleRoutes.post('/register', proccessRegister);
vehicleRoutes.post('/exit', exitRegister);
vehicleRoutes.post('/payment', createPaymentLink);
vehicleRoutes.post('/payment/confirm', confirmPayment);
vehicleRoutes.get('/payment/callback', handlePaymentCallback);
vehicleRoutes.get('/hourlyRate', hourlyRate); 
vehicleRoutes.get('/suscription', suscription); 
vehicleRoutes.post('/newVehicle' , registNew);   
vehicleRoutes.get('/suscription', suscription);
vehicleRoutes.post('/registPlan', registPlan); 
vehicleRoutes.post('/Exitpermission', registExitAndPayment) 

export default vehicleRoutes;
