
import {config} from "./config.ts"
import {format,createLogger,transports} from "winston"

const {combine,timestamp,printf,colorize,uncolorize} = format

const myFormat = printf(({level,stack,message,timestamp})=>{
    return `${timestamp}:${level} ${stack||message}`
})

const logger = createLogger({
    level:config.nodeEnv === "development" ? "debug" : "info",
    format:combine(
        timestamp({format:"YYYY-MM-DD HH:mm:ss"}),
        myFormat,
        config.nodeEnv ==="development" ? colorize():uncolorize()
    ),
    transports : [new transports.Console()]
})

export default logger;