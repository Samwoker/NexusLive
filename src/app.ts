import express from "express";
import type { Application,Request,Response, NextFunction } from "express";
import cors from "cors"
import helmet from "helmet"
import { errorConverter,errorHandler } from "./middlewares/error.ts";
import CustomError from "./utils/customError.ts";
import httpStatus from "http-status";
import * as morgan from "./config/morgan.ts"
import cookieParser from "cookie-parser"
import  authRouter from './routes/auth.routes.ts'
import sessionRoute from './routes/session.routes.ts'
import webauthnRoute from "./routes/webauthn.routes.ts"


const app: Application = express();

app.use(cors())
app.use(helmet())
app.use(express.json());
app.use(cookieParser())
app.use(morgan.successHandler)
app.use(morgan.errorHandler)


//auth routes
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/sessions",sessionRoute)
app.use("/api/v1/webauthn",webauthnRoute)

app.use((req:Request,res:Response,next:NextFunction)=>{
     new CustomError(httpStatus.NOT_FOUND,"Not Found")
})
app.use(errorConverter)
app.use(errorHandler)


export default app;