import { registerVehicle, exitVehicle, getHourlyVehicule, getSuscriptionVehicule, regiterNewVehicle, registNewPlan} from "../repositories/vehicle.repository.js";

// Validate the payload and delegate the registration logic to the repository.
export const registerService = async (plate, typeVehicle) => {
    if (!plate || !typeVehicle) {
        throw new Error("Plate or type is required");
    }
    const regist = await registerVehicle(plate, typeVehicle);

    return regist;
};

export const exitSession = async (plate) => {
    if (!plate) {
        throw new Error("Plate or type is required");
    }
    const regist = await exitVehicle(plate); 

    return regist;
}; 

export const  allHourlyRate = async() => { 
    const vehicle = await getHourlyVehicule(); 

    if(!vehicle.length){
        return[{state : "empty"}]  
    } 

    return vehicle; 
} 

export const  allSuscription = async() => { 
    const vehicle = await getSuscriptionVehicule(); 

    if(!vehicle.length){
        return[{state : "empty"}]  
    } 

    return vehicle; 
} 

export const registerNew = async (plate, vehicleType) => { 
    
    if(!plate || !vehicleType) {
        throw new Error("Plate or type is required") 
    }
    
    const newVehicle = await regiterNewVehicle(plate, vehicleType); 
    
    return newVehicle
} 

export const registNewVehiclePlan = async(plate, planType , amount , status , idMercadoPago) => {
    if(!plate || !planType || !amount || !status || !idMercadoPago) {
        throw new Error("All fields are required");
    }
    const newPlan = await registNewPlan(plate, planType, amount, status, idMercadoPago);
    return newPlan;
}