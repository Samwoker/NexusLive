import express from 'express'
import * as authController from '../controllers/auth.controllers.ts'
import * as userValidation from '../validation/user.validation.ts'
import {validate} from '../middlewares/validation.ts'
const router = express.Router()


router.post("/signup",validate(userValidation.createUserSchema),authController.createUser)
router.post("login",validate(userValidation.createLoginSchema),authController.login)

export default router