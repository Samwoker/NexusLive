import axios from "axios";
import { type Request , type Response,type NextFunction, response } from "express";
import httpStatus from "http-status";
import {config} from "../config/config.ts"

export const verifyCaptcha = async(req:Request, res:Response,next:NextFunction)=>{
    try {
        const token = req.body["g-recaptcha-response"];
        // token comes from frontend
        if(!token){
            return res.status(httpStatus.BAD_REQUEST).json({message:"Captcha token missing"})
        }
        const url = `https://www.google.com/recaptcha/api/siteverify`;
        const {data} = await axios.post(url,null,{
            params:{secret:config.recaptcha.recaptchaSecretKey,response:token}
        })
        if(!data.success || data.score === 0){
            return res.status(httpStatus.FORBIDDEN).json({message:"Captcha validation failed"})
        }
        next();
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"Captcha verification error",error})
    }
}