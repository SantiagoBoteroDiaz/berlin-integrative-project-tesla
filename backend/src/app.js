import { connectPostgres } from './config/database.js'; 
import express from 'express';
import registerVehicleRoutes from './routes/registerVehicle.routes.js';
await connectPostgres() 

const app = express() ; 
app.use(express.json());

app.use('/regist' , registerVehicleRoutes) 

export default app;