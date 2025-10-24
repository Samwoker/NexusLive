import nodemailer from "nodemailer";
import {config} from "../config/config.ts";


export const sendEmail = async (to:string,subject:string,html:string)=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:config.smtp.smtpEmail,
            pass:config.smtp.smtpPassword
        }
    })
    await transporter.sendMail({
        from:`NexusLive <nexuslive@pro.com>`,
        to,
        subject,
        html
    })
}