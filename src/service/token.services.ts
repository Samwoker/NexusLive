import jwt from "jsonwebtoken"
import {config} from "../config/config.ts"
import httpStatus from "http-status"
import CustomError from "../utils/customError.ts"
import Token from "../models/token.model.ts"
import dayjs from "dayjs"
import type {IToken} from "../models/token.model.ts"
import type mongoose from "mongoose"
import { tokenTypes } from "../config/tokens.ts"

export const generateToken = (userId:mongoose.Schema.Types.ObjectId,type:string,expires:Date,secret=config.jwt.jwtSecret)=>{
    const payload = {
        sub:userId,
        iat:dayjs().unix(),
        exp:Math.floor(expires.getTime()/1000),
        type
    }
    return jwt.sign(payload , secret)
}

export const saveToken = async(token:string,userId:mongoose.Schema.Types.ObjectId,expires:Date,type:string,blacklisted = false):Promise<IToken>=>{
    const tokenDoc = await Token.create({
        token,
        user:userId,
        expires:expires,
        type,
        blacklisted
    })
    return tokenDoc
}

export const verifyToken = async (token:string,type:string):Promise<IToken>=>{
    const payload = jwt.verify(token,config.jwt.jwtSecret) as jwt.JwtPayload
    const tokenDoc = await Token.findOne({
        token,
        user:payload.sub,
        type,
        blacklisted:false
    })
    if(!tokenDoc){
        throw new CustomError(httpStatus.NOT_FOUND,"Token not found")
    }

    return tokenDoc
}

export const generateAuthTokens = async (userId:mongoose.Schema.Types.ObjectId)=>{
    const accessTokenExpires = dayjs().add(
        config.jwt.jwtAccessExpirationMinutes,"minute"
    )
    const accessToken = await generateToken(
        userId,
         tokenTypes.ACCESS,
        accessTokenExpires.toDate(),
       
    )
    const refreshTokenExpires =dayjs().add(
        config.jwt.jwtRefreshExpirationDays,"day"
    )
    const refreshToken = await generateToken(
        userId,
           tokenTypes.REFRESH,
        refreshTokenExpires.toDate(),
     
    )

    await saveToken(refreshToken,userId,refreshTokenExpires.toDate(),tokenTypes.REFRESH);
    return {
        access:{
            token:accessToken,
            expires:accessTokenExpires.toDate()
        },
        refresh:{
            token:refreshToken,
            expires:refreshTokenExpires.toDate()
        }
    }
}