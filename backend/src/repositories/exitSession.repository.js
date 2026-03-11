import { pool } from "../config/database.js";


export const exitVehicle = async (plate) => {
    const query = `SELECT * FROM process_vehicle_exit($1); `;
    const data = [plate];
    const result = await pool.query(query, data);
    return result.rows[0];
};
