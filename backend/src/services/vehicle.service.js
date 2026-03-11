import { registerVehicle, exitVehicle} from "../repositories/vehicle.repository.js";

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
