import jwt from "jsonwebtoken"
import {config} from "../config/config.ts"
import httpStatus from "http-status"
import CustomError from "../utils/customError.ts"
import type { PayloadType } from "../types/global.ts"

export const generateToken =  (payload:PayloadType):string =>{
    try {
        const token =  jwt.sign(payload,config.jwt.jwtSecret,{
        expiresIn:"1h"
    })
    return token
    } catch (error) {
     throw new CustomError(httpStatus.INTERNAL_SERVER_ERROR,"Failed to generate token")   
    }
    
}

export const verifyToken = (token:string):PayloadType =>{
    const payload = jwt.verify(token,config.jwt.jwtSecret) as PayloadType
    if(!payload){
        throw new CustomError(httpStatus.NOT_FOUND,"Token not found")
    }
    return payload
}