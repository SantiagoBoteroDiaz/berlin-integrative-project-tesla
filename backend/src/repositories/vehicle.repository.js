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
//get all suscriptions 
export const getSuscriptionVehicule = async() => {
    const query = `select * from public.suscription;` 
    const result = await pool.query(query) 
    return result.rows 
} 

//regist new vehicles

export const regiterNewVehicle = async (plate , vehicleType) => { 
    const query = `insert into vehicle (plate, vehicle_type_id) values($1 , (select id from vehicle_type vt where vt."name" = $2)) returning *;` 
    const values = [plate, vehicleType]     
    const result  = await pool.query(query, values); 
    return result.rows
}   

// regist planes 

export const registNewPlan = async (plate, planType , amount , status , idMercadoPago) => {
    const query = `SELECT * FROM create_subscription_payment($1, $2,$3,$4,$5); `
    const values = [plate , planType, amount, status, idMercadoPago] 
    const result = await pool.query(query, values)
    return result.rows 
}  


export const paymentAndExit = async (plate, idMercadoPago, amount, status) => {
    const query = `SELECT * FROM generate_exit_ticket_and_payment($1,$2,$3,$4);`  
    const values = [plate, idMercadoPago, amount, status] 
    const result = await pool.query(query, values); 
    return result.rows 
}