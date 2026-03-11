import { Pool } from "pg";
import { env } from "./env.js";

// Shared pool reference so repositories can reuse the same PostgreSQL connection.
export let pool;

// Establishes a database connection pool using environment-driven credentials.
export const connectPostgres = async () => {
    try {
        const poolPg = new Pool({
            host: env.DB.HOST,
            port: env.DB.PORT,
            database: env.DB.NAME,
            user: env.DB.USER,
            password: env.DB.PASSWORD
        });

        await poolPg.connect();

        console.log("Postgres is connected");

        pool = poolPg;

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
