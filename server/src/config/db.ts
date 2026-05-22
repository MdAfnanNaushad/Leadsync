import mongoose from "mongoose";
import process from "process";

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "Database initialization aborted: MONGO_URI string environment variable is completely undefined.",
      );
    }

    const connectionInstance = await mongoose.connect(mongoUri);
    console.log(
      `📡 MongoDB operational stream established safely with host connection point: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error(
      "❌ Critical Error: Database communication engine failed to connect:",
      error,
    );
    process.exit(1); // Drop the active server process instantly on connection failure
  }
};
