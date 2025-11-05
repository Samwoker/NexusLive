
import {TOTP} from "otpauth";
import QRCode from "qrcode";
import type { TwoFactorSecret } from "../types/global";

export const generateTwoFactorSecret=async (email:string):Promise<TwoFactorSecret>=>{
    const totp = new TOTP({
        issuer:"NexusLive",
        label:email,
        algorithm:"SHA1",
        digits:6,
        period:30
    })
    const secret = totp.secret.base32;
    const otpauthUrl = totp.toString()
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
    return {secret,otpauthUrl,qrCodeDataUrl}
}

export const verifyTwoFactorToken=(token:string,secret:string):boolean =>{
    const totp = new TOTP({secret})
    const isValid = totp.validate({token,window:1})
    return !!isValid
}
