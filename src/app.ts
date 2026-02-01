import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import { setupSwagger } from "./config/swagger";

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5173", "https://yourapp.netlify.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

/* ✅ Handle preflight explicitly (IMPORTANT) */
app.options("*", cors());

app.use(express.json());

setupSwagger(app);

app.use("/api", router);

export default app;
