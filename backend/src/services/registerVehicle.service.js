import { registerVehicle } from "../repositories/registerVehicle.repository.js"; 

export const registerService = async (plate , typeVehicle) => {
    if(!plate || !typeVehicle){
        throw new Error("Plate or type is required") ;
    } 
    const regist = await registerVehicle(plate , typeVehicle) 

    return regist
} 