import type { NextFunction, Request, Response } from "express";
import {config} from "../config/config.ts"
import logger from "../config/logger.ts";
import httpStatus from "http-status";
import CustomError from "../utils/customError.ts";
import mongoose from "mongoose";


export const errorConverter = (err:Error
                              ,req:Request,
                              res:Response,
                              next:NextFunction)=>{
   let error = err;
   if(!(error instanceof CustomError)){
      const statusCode = (error as any).statusCode && typeof (error as any).statusCode ==="number"
      ? (error as any).statusCode 
      :error instanceof mongoose.Error
      ?httpStatus.BAD_REQUEST
      :httpStatus.INTERNAL_SERVER_ERROR
      let message = (error as any).message || (httpStatus[statusCode as keyof typeof httpStatus]) as string
      error = new CustomError(statusCode,message,false,(err as any).stack)
      }
      next(error)
}

export const errorHandler = (err:Error
                            ,req:Request
                            ,res:Response
                            ,next:NextFunction)=>{


   let {statusCode , message} = err as any; 
   const isOperational = (err as any).isOperational;
   if(config.nodeEnv === "production" && !isOperational){
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[statusCode as keyof typeof httpStatus] as string
   }
   const response ={
      error:true,
      code:statusCode,
      message,
      ...(config.nodeEnv === "development" && {stack:err.stack})
   }
    res.locals.errorMessage = message;
    if(config.nodeEnv === "development"){
      logger.error(err)
    } 
    res.status(statusCode).send(response);
    next();
}

