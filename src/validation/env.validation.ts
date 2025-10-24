import Joi from "joi";

export const envSchema = Joi.object({
    PORT:Joi.number().positive().default(3000),
    MONGO_URI:Joi.string().uri().required(),
    NODE_ENV:Joi.string().valid("development","production","test").default("development"),
    JWT_SECRET:Joi.string().required(),
    JWT_ACCESS_EXPIRATION_MINUTES:Joi.number().default(30).required(),
    JWT_REFRESH_EXPIRATION_DAYS:Joi.number().default(30).required(),
    SMTP_PASSWORD:Joi.string().required(),
    SMTP_EMAIL:Joi.string().email().required(),
}).unknown()

