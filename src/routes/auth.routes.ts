import express from 'express'
import * as authController from '../controllers/auth.controllers.ts'
import * as userValidation from '../validation/user.validation.ts'
import {validate} from '../middlewares/validation.ts'
import * as twoFactorController from "../controllers/twoFactorRController.ts"
import authenticate from "../middlewares/auth.ts"
import passport from 'passport'
import { authLimiter } from '../middlewares/authLimiter.ts'
import * as sessionController from "../controllers/session.controllers.ts"

const router = express.Router()


router.post("/signup",validate(userValidation.createUserSchema),authController.createUser)
router.post("/login",authLimiter,validate(userValidation.createLoginSchema),authController.login)
router.post("/logout",authController.logout)
router.post("/refresh-token",authController.refreshToken)
router.post("verify-email",authController.verifyEmail)
router.post("/resend-verification-email",authController.resendVerificationEmail)
router.post("/forgot-password",authController.forgotPassword)
router.post("/reset-password",authController.resetPassword)
router.post("/2fa/generate-secret",authenticate,twoFactorController.generateSecret)
router.post("/2fa/verify-token",authenticate,twoFactorController.verifyToken)
router.post("/2fa/validate-token",authenticate,twoFactorController.validateToken)
router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))
router.get("/google/callback",passport.authenticate("google",{session:false}),authController.googleLoginCallback)
router.get("/sessions",authenticate,sessionController.sessions)
router.delete("/sessions/:sessionId",authenticate,sessionController.revokeSession)


export default router