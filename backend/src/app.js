import { connectPostgres } from './config/database.js';
import express from 'express';
import registerVehicleRoutes from './routes/registerVehicle.routes.js';

// Initialize the database connection before wiring routes.
await connectPostgres();

const app = express();
app.use(express.json());

// Mount the vehicle registration routes under a deterministic URL segment.
app.use('/regist', registerVehicleRoutes);

export default app;
