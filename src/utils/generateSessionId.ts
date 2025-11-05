import {createHash} from "crypto"

export const generateSessionId = ()=>{
    return crypto.randomUUID()
}