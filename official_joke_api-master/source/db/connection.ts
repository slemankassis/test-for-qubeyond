import { Pool } from "pg";

// Database configuration
const config = {
  user: "jokesuser",
  password: "jokespassword",
  host: "localhost",
  port: 5432,
  database: "jokes_api_db",
};

// Create a new Pool instance
const pool = new Pool(config);

// Log connections
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

// Log errors
pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
