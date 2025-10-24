import express from 'express'
import * as authController from '../controllers/auth.controllers.ts'
import * as userValidation from '../validation/user.validation.ts'
import {validate} from '../middlewares/validation.ts'
const router = express.Router()


router.post("/signup",validate(userValidation.createUserSchema),authController.createUser)
router.post("/login",validate(userValidation.createLoginSchema),authController.login)
router.post("/logout",authController.logout)
router.post("/refresh-token",authController.refreshToken)
router.post("verify-email",authController.verifyEmail)
router.post("/resend-verification-email",authController.resendVerificationEmail)
router.post("/forgot-password",authController.forgotPassword)
router.post("/reset-password",authController.resetPassword)


export default router