import { pool } from "../config/database.js";

// Calls the stored procedure that records vehicle entry linked to a decoded vehicle type.
export const registerVehicle = async (plate, typeVehicle) => {
    const query = `SELECT public.enter_parking($1, (select id from public.vehicle_type vt where vt."name" = $2));`;
    const data = [plate, typeVehicle];
    const result = await pool.query(query, data);

    return result.rows[0];
};
