import type { Request,Response,NextFunction } from "express"
import * as userService from "../service/user.services.ts"
import mongoose from "mongoose";
import httpStatus from "http-status"

export const getUser = async(req:Request,res:Response,next:NextFunction)=>{
    const {userId} = req.params;
    const id = new mongoose.Types.ObjectId(userId)
    try {
        const user = await userService.getUserById(id as unknown as mongoose.Schema.Types.ObjectId);
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message:"User not found"})
        }
        (req as any).user = user;
        next()
    } catch (error) {
        next(error);
    }
}