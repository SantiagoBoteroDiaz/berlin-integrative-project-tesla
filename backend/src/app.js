import { connectPostgres } from './config/database.js';
import express from 'express';
import vehicleRoutes from './routes/vehicle.routes.js';
import cors from "cors" 

// Initialize the database connection before wiring routes.
await connectPostgres();

const app = express(); 
app.use(cors()) 
app.use(express.json());

// Mount the vehicle registration routes under a deterministic URL segment.
app.use('/vehicle', vehicleRoutes );


export default app;
