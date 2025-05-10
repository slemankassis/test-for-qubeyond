import express, { Request, Response, NextFunction } from "express";
import LimitingMiddleware from "limiting-middleware";
import jokeRoutes from "./routes/jokeRoutes";

// Define custom error interface
interface ApiError extends Error {
  statusCode?: number;
}

// Initialize Express app
const app = express();

// Apply middlewares
app.use(new LimitingMiddleware().limitByIp());

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Register routes
app.use("/", jokeRoutes);

// Error handling middleware
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    type: "error",
    message: err.message,
  });
});

// Define port
const PORT = process.env.PORT || 3005;

// Start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// Export the app for testing purposes
export default app;
