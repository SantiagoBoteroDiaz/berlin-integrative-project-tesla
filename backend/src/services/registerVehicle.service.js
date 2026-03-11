import { registerVehicle } from "../repositories/registerVehicle.repository.js";

// Validate the payload and delegate the registration logic to the repository.
export const registerService = async (plate, typeVehicle) => {
    if (!plate || !typeVehicle) {
        throw new Error("Plate or type is required");
    }
    const regist = await registerVehicle(plate, typeVehicle);

    return regist;
};
