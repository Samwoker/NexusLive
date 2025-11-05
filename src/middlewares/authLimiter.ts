import { RateLimiterMongo } from "rate-limiter-flexible";
import mongoose  from "mongoose";
import {config} from "../config/config.ts"
import type {Request ,Response, NextFunction } from "express";

export const rateLimiterOptions = {
    storeClient:mongoose.connection,
    dbName:"NexusLive",
    blockedDuration:60 * 60 * 24
}

export const emailIpBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptions,
    points:config.rateLimiter.maxAttemptsByIPUsername,
    duration:60 * 10,
})

export const slowBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptions,
    points:config.rateLimiter.maxAttemptsPerDay,
    duration:60*60*24
})
export const emailBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptions,
    points:config.rateLimiter.maxAttemptsPerEmail
})

export const authLimiter = async (req:Request , res:Response , next:NextFunction)=>{
    const ipAddr = req.socket.remoteAddress || "unknown_ip";
    const emailIpKey = `${req.body.email}_${ipAddr}`
    const [slowBruteRes , emailIpRes,emailBruteRes] = await Promise.all([
        slowBruteLimiter.get(ipAddr),
        emailIpBruteLimiter.get(emailIpKey),
        emailBruteLimiter.get(req.body.email)
    ]);
    let retrySeconds = 0 ;
    if(slowBruteRes && slowBruteRes.consumedPoints >= config.rateLimiter.maxAttemptsPerDay){
        retrySeconds = Math.floor(slowBruteRes.msBeforeNext /1000) || 1
    }else if(emailIpRes && emailIpRes?.consumedPoints >= config.rateLimiter.maxAttemptsPerEmail){
        retrySeconds = Math.floor(emailIpRes.msBeforeNext /1000) ||1
    }else if(emailBruteRes && emailBruteRes?.consumedPoints >= config.rateLimiter.maxAttemptsByIPUsername){
        retrySeconds = Math.floor(emailBruteRes.msBeforeNext / 1000) ||1
    }
    next()
}
