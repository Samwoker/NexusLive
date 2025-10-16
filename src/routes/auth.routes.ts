import express from 'express'
import * as authController from '../controllers/auth.controllers.ts'
import * as userValidation from '../validation/user.validation.ts'
import {validate} from '../middlewares/validation.ts'
const router = express.Router()


router.post("/sign-up",validate(userValidation.createUserSchema),authController.createUser)

export default router