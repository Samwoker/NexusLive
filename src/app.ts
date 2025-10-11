import express from "express";
import type { Application } from "express";
import cors from "cors"
import helmet from "helmet"
const app: Application = express();

app.use(cors())
app.use(helmet())
app.use(express.json());

export default app;