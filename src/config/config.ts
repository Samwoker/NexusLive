import dotenv from "dotenv";
dotenv.config();
import logger from "./logger.ts";
import { envSchema } from  "../validation/env.validation.ts";
import type { AppConfig } from "../types/global";;
const {value:envVars,error} = envSchema.validate(process.env);

if(error){
    logger.error("Config validation error:",error.message);
}

export const config:AppConfig={
    port:envVars.PORT,
    dbConnection:envVars.MONGO_URI,
    nodeEnv:envVars.NODE_ENV,
     jwt:{
        jwtSecret:envVars.JWT_SECRET,
        jwtAccessExpirationMinutes:envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        jwtRefreshExpirationDays:envVars.JWT_REFRESH_EXPIRATION_DAYS,
     }
    
}