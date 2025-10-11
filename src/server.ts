import mongoose  from "mongoose";
import http, { Server } from "http"
import app from "./app.ts"
import {config} from "./config/config.ts"
import logger from "./config/logger.ts";
import type { Application } from "express";

mongoose.connect(config.dbConnection as string).then(()=>{
    logger.info("mongodb connected successfully")
}).catch((error:Error)=>{
    logger.error("mongodb connection error:",error.message)
})

const httpServer:Server = http.createServer(app as Application);
const server = httpServer.listen(config.port,()=>{
    logger.info(`Server is running on port ${config.port}`)
})

const unExpectedErrorHandler = (error:Error)=>{
    logger.error("Uncaught Exception:",error);
    exitHandler();
}

const exitHandler = ()=>{
    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }else{
        process.exit(1);
    }
}

process.on("uncaughtException",unExpectedErrorHandler);
process.on("unhandledRejection",unExpectedErrorHandler);

process.on("SIGTERM",()=>{
    console.log("SIGTERM received");
    if(server){
        server.close()
    }
})