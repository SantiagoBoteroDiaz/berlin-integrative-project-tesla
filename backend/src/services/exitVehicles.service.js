import { exitVehicle } from "../repositories/exitSession.repository.js";

// Validate the payload and delegate the registration logic to the repository.
export const exitSession = async (plate) => {
    if (!plate) {
        throw new Error("Plate or type is required");
    }
    const regist = await exitVehicle(plate); 

    return regist;
};
