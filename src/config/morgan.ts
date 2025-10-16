import morgan from "morgan"
import {config} from "./config.ts"
import fs from "fs"
import path from "path"
import url from "url"
import type { Request,Response } from "express"

morgan.token("message",(req:Request,res:Response)=> res.locals.errorMessage || "")

const getIpFormat = ()=> config.nodeEnv === "production"?":remote-addr":""

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logDir = path.join(__dirname,"..","logs")

if(!fs.existsSync(logDir)){
    fs.mkdirSync(logDir)
}
const accessLogStream = fs.createWriteStream(path.join(logDir,"access.log"),{flags:"a"})

const successHandlerFormat = `${getIpFormat()} :method :url :status :response-time ms :user-agent :date[web]`
const errorHandlerFormat = `${getIpFormat()} :method :url :status :response-time ms :user-agent :date[web] -error-message :message `

export const successHandler = morgan(successHandlerFormat,{
    stream:accessLogStream,
    skip:(req:Request,res:Response)=> res.statusCode >= 400
})

export const errorHandler = morgan(errorHandlerFormat,{
    stream:accessLogStream,
    skip:(req:Request,res:Response)=> res.statusCode <400
})