import joi from 'joi'

export const createUserSchema ={
  body:joi.object().keys({
    name:joi.object().keys({
      first:joi.string().required().trim().min(3),
       last:joi.string().required().trim().min(3),
    }).required(),
    birthday:joi.date().required(),
    gender:joi.string().valid("male","female").required(),
    password:joi.string().required().trim(),
    confirmPassword:joi.string().required().trim(),
    username:joi.string().required().trim(),
    email:joi.string().required()
  }),
  
}

export const createLoginSchema = {
  body:joi.object().keys({
    email:joi.string().trim().required(),
    password:joi.string().required().trim()
  })
}