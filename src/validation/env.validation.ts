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
    GOOGLE_CLIENT_ID:Joi.string().required(),
    GOOGLE_CLIENT_SECRET:Joi.string().required(),
    GOOGLE_CALLBACK_URL:Joi.string().required(),
    MAX_ATTEMPTS_BY_IP_USERNAME:Joi.number().required(),
    MAX_ATTEMPTS_PER_DAY:Joi.number().required(),
    MAX_ATTEMPTS_PER_EMAIL:Joi.number().required(),
    RECAPTCHA_SITE_KEY:Joi.string().required(),
    RECAPTCHA_SECRET_KEY:Joi.string().required()
}).unknown()

