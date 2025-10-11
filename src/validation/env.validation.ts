import Joi from "joi";

export const envSchema = Joi.object({
    PORT:Joi.number().positive().default(3000),
    MONGO_URI:Joi.string().uri().required(),
    NODE_ENV:Joi.string().valid("development","production","test").default("development")
}).unknown()

