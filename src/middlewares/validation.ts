import type { Request,Response,NextFunction } from "express";
import CustomError from "../utils/customError.ts";
import joi  from 'joi'
import type {ObjectSchema} from 'joi'

export const validate=(schema:Record<string,ObjectSchema>) =>(req:Request,res:Response,next:NextFunction):void=>{

        const keys = Object.keys(schema);
        const object = keys.reduce<Record<string,unknown>>((obj,key)=>{
            if(Object.prototype.hasOwnProperty.call(req,key)){
                obj[key]=(req as any)[key]
            }
            return obj
        },{})
    const {value,error} = joi.compile(schema).validate(object);
        if(error){
            const errors= error.details.map(detail => detail.message).join(",")
             next(new CustomError(400,errors))
        }
    next()
}