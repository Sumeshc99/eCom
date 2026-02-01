import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import { setupSwagger } from "./config/swagger";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use("/api", router);

export default app;
