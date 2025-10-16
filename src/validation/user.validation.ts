import joi from 'joi'

export const createUserSchema ={
  body:joi.object().keys({
    name:joi.object().keys({
      first:joi.string().required().trim().min(3),
       last:joi.string().required().trim().min(3),
    }).required(),
    birthday:joi.date().required(),
    gender:joi.string().valid("male","female").required(),
    password:joi.string().required().trim()
  })
}