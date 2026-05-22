import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { globalErrorHandler } from "./middleware/error.middleware";
import { AppError } from "./utils/AppError";

dotenv.config();

const app: Application = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({
      status: "success",
      message: "Leadsync API gateway server is running",
    });
});
app.all("*all", (req: Request, res: Response, next) => {
  next(
    new AppError(
      `Cannot find requested route context profile: ${req.originalUrl} on this gateway server.`,
      404,
    ),
  );
});
// Centralized Global Error Interceptor Engine Linkage
app.use(globalErrorHandler);

export default app;
