import catchAsync from "../utils/catchAsync.ts";
import httpStatus from 'http-status'
import type {Request,Response} from 'express'
import * as userService from '../service/user.services.ts'

export const createUser=catchAsync(async(req:Request , res:Response)=>{
    const user = await userService.createUser(req.body)
    res.status(httpStatus.CREATED).json(user)
})