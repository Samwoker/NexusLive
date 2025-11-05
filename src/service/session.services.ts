
import { Session } from "../models/session.model.ts";

export const getSessionByUserId = async(userId:string)=>{
  const sessions = await Session.findOne({userId})
  return sessions
}