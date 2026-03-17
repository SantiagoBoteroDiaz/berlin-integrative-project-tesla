import { Router } from "express";
import {
  proccessRegister,
  exitRegister,
  createPaymentLink,
  createSubscriptionPayment,
  hourlyRate,
  suscription,
  registNew,
<<<<<<< HEAD
  registPlan,
  registExitAndPayment
=======
  registPlan, 
  getDashboard
>>>>>>> 7f0445310308728756fd6a07d478c37e9e71a107
} from "../controllers/vehicle.controller.js";
import { confirmPayment, handlePaymentCallback } from "../controllers/vehicle.controller.js"; 
const vehicleRoutes = Router();

// Only POST requests are allowed for vehicle registration workflow. 

vehicleRoutes.post('/register', proccessRegister);
vehicleRoutes.post('/exit', exitRegister);
vehicleRoutes.post('/payment', createPaymentLink);
vehicleRoutes.post('/payment/subscription', createSubscriptionPayment);
vehicleRoutes.post('/payment/confirm', confirmPayment);
vehicleRoutes.get('/payment/callback', handlePaymentCallback);
vehicleRoutes.get('/hourlyRate', hourlyRate); 
vehicleRoutes.get('/suscription', suscription); 
vehicleRoutes.post('/newVehicle' , registNew);   
vehicleRoutes.post('/registPlan', registPlan); 
<<<<<<< HEAD
vehicleRoutes.post('/exitPermission', registExitAndPayment);
=======
vehicleRoutes.get('/dashboard', getDashboard); 
>>>>>>> 7f0445310308728756fd6a07d478c37e9e71a107

export default vehicleRoutes;
