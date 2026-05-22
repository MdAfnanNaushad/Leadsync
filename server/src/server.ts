import dotenv from "dotenv";
import path from "path";

// Intercept unexpected system crashes caused by bugs in synchronous code blocks
process.on("uncaughtException", (error: Error) => {
  console.error(
    "💥 UNCAUGHT EXCEPTION TRIGGERED! Server lifecycle shutting down safely...",
    error,
  );
  process.exit(1);
});

// Resolve local dot-environment variables path
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "./app";
import {connectDatabase} from './config/db'

// Initialize the Database Connection Pipeline Stream
connectDatabase();

const serverPort = process.env.PORT || 5000;

const operationalServerInstance = app.listen(serverPort, () => {
  console.log(
    `🚀 Leadsync Engine Active. Server running securely over operational port: ${serverPort}`,
  );
});

// Intercept unexpected system crashes caused by bugs in asynchronous code blocks
process.on("unhandledRejection", (error: Error) => {
  console.error(
    "💥 UNHANDLED REJECTION DETECTED! Shifting downstream processes off smoothly...",
    error,
  );
  operationalServerInstance.close(() => {
    process.exit(1);
  });
});
