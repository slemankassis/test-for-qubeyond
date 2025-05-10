import express, { Request, Response, NextFunction } from "express";
import LimitingMiddleware from "limiting-middleware";
import jokeRoutes from "./routes/jokeRoutes";
import dotenv from "dotenv";

dotenv.config();

interface ApiError extends Error {
  statusCode?: number;
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(new LimitingMiddleware().limitByIp());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/", jokeRoutes);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    type: "error",
    message: err.message,
  });
});

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default app;
