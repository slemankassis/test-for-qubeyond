import express, { Request, Response, NextFunction } from "express";
import LimitingMiddleware from "limiting-middleware";
import jokeRoutes from "./routes/jokeRoutes";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();

interface ApiError extends Error {
  statusCode?: number;
}

const app = express();

app.use(cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  }) as express.RequestHandler,
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(apiLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(new LimitingMiddleware().limitByIp());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`requesterIp ${req.ip}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With",
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use("/", jokeRoutes);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred";

  console.error(`[ERROR] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default app;
