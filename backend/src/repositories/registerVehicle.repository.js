import { pool } from "../config/database.js"; 

export const registerVehicle = async(plate , typeVehicle)=> {
    const query = `SELECT public.enter_parking($1, (select  id from public.vehicle_type vt where vt."name" = $2)
); `
    const data = [plate , typeVehicle] 
    const result = await pool.query(query, data) 
    console.log("hola");
    
    return result.rows[0] 
}