// @ts-ignore
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.DB_USER || "jokesuser",
  password: process.env.DB_PASSWORD || "jokespassword",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "jokes_api_db",
};

const pool = new Pool(config);

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
