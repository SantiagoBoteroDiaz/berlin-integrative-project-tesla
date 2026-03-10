import { Router } from "express"; 
import { proccessRegister } from "../controllers/registerVehicle.controller.js"; 

const registerVehicleRoutes = Router() 

registerVehicleRoutes.post('/' , proccessRegister);  

export default registerVehicleRoutes 