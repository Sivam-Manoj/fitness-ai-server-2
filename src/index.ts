import express, { Request, Response, NextFunction } from "express";
import { appConfigWithDb } from "./config/appConfigWithDb.js";
import aiRoutes from "./routes/chromaDbRoutes/chromaDbRoutes.js";
import cors, { CorsOptions } from "cors";
import errorHandler from "./middleware/error/ErrorHandler.js";
import { configDotenv } from "dotenv";

configDotenv();

// Get the allowed frontend URLs from the environment variable
const allowedOrigins: string[] = process.env.FRONTEND_URL?.split(",") || [];
console.log(allowedOrigins);
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow requests from the allowed origins or if there's no origin (e.g., server-side request)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the origin
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "securityKey",
    "securitykey",
  ], // Allowed headers
  optionsSuccessStatus: 200, // Status code for successful OPTIONS requests
};

const app = express();

// Default middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/ai", aiRoutes);

// Custom error handler
app.use(errorHandler);

// Start server with database
appConfigWithDb(app);
