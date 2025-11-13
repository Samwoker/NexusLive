import dotenv from "dotenv";
dotenv.config();
import { envSchema } from  "../validation/env.validation.ts";
import type { AppConfig } from "../types/global";;
const {value:envVars,error} = envSchema.validate(process.env);

if(error){
    console.error("Config validation error:",error.message);
}

export const config:AppConfig={
    port:envVars.PORT,
    dbConnection:envVars.MONGO_URI,
    nodeEnv:envVars.NODE_ENV,
     jwt:{
        jwtSecret:envVars.JWT_SECRET,
        jwtAccessExpirationMinutes:envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        jwtRefreshExpirationDays:envVars.JWT_REFRESH_EXPIRATION_DAYS,
     },
     smtp:{
        smtpEmail:envVars.SMTP_EMAIL,
        smtpPassword:envVars.SMTP_PASSWORD,
     },
     baseUrl:envVars.BASE_URL,
     googleClientId:envVars.GOOGLE_CLIENT_ID,
     googleClientSecret:envVars.GOOGLE_CLIENT_SECRET,
     googleCallbackUrl:envVars.GOOGLE_CALLBACK_URL,
     rateLimiter:{
      maxAttemptsByIPUsername:envVars.MAX_ATTEMPTS_BY_IP_USERNAME,
      maxAttemptsPerDay:envVars.MAX_ATTEMPTS_PER_DAY,
      maxAttemptsPerEmail:envVars.MAX_ATTEMPTS_PER_EMAIL
     },
     recaptcha:{
      recaptchaSecretKey:envVars.RECAPTCHA_SECRET_KEY,
      recaptchaSiteKey:envVars.RECAPTCHA_SITE_KEY
     },
     cloudinary:{
      cloudinaryCloudName:envVars.CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey:envVars.CLOUDINARY_API_KEY,
      cloudinaryApiSecret:envVars.CLOUDINARY_API_SECRET
     }
}