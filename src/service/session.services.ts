
import { Session } from "../models/session.model.ts";
import CustomError from "../utils/customError.ts";
import httpStatus from "http-status"

export const getSessionByUserId = async(userId:string)=>{
  const sessions = await Session.findOne({userId})
  if(!sessions){
    throw new CustomError(httpStatus.NOT_FOUND,"Session not found")
  }
  return sessions
}

export const findSessionAndDelete = async(userId:string,sessionId:string)=>{
    const session = await Session.findOneAndDelete({userId,sessionId})
    if(!session){
        throw new CustomError(httpStatus.NOT_FOUND,"Session not found")
    }
}