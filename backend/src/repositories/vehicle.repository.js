import { pool } from "../config/database.js";

// regist vehicule in data base 
export const registerVehicle = async (plate, typeVehicle) => {
    const query = `SELECT public.enter_parking($1, (select id from public.vehicle_type vt where vt."name" = $2));`;
    const data = [plate, typeVehicle];
    const result = await pool.query(query, data);

    return result.rows[0];
};
 
// regist exit in data base 

export const exitVehicle = async (plate) => {
    const query = `SELECT * FROM process_vehicle_exit($1); `;
    const data = [plate];
    const result = await pool.query(query, data);
    return result.rows[0];
};

// get all vehicles whit suscription 

export const getHourlyVehicule = async() => {
    const query = `select * from public.hourly_date;` 
    const result = await pool.query(query) 
    return result.rows 
}

export const getSuscriptionVehicule = async() => {
    const query = `select * from public.suscription;` 
    const result = await pool.query(query) 
    return result.rows 
}