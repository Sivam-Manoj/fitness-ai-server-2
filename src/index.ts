import express from "express";
import { appConfigWithDb } from "./config/appConfigWithDb.js";
import aiRoutes from "./routes/chromaDbRoutes/chromaDbRoutes.js";
import cors from "cors";
import errorHandler from "./middleware/error/ErrorHandler.js";
import { configDotenv } from "dotenv";

configDotenv();

const corsOptions = {
  origin: process.env.FRONTEND_URL, // Allow only specific domain
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

//defualt middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/ai", aiRoutes);

//custom error handler
app.use(errorHandler);

//start server with database
appConfigWithDb(app);
