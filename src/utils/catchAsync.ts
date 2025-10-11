import type { NextFunction, Response,Request } from "express";

const catchAsync = (fun:Function)=>(req:Request,res:Response,next:NextFunction)=>{
    Promise.resolve(fun(req,res,next)).catch((error)=>next(error))
}

export default catchAsync;