import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import { setupSwagger } from "./config/swagger";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      //   "https://your-frontend.app", // later: Vercel/Netlify URL
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

setupSwagger(app);

app.use("/api", router);

export default app;
