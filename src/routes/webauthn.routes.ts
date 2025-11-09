import express from "express"
import { authLimiter } from "../middlewares/authLimiter.ts";
import * as webauthnController from "../controllers/webauthn.controllers.ts"

const router = express.Router()

router.post("/register-options",webauthnController.registerOptions)
router.post("/register",authLimiter,webauthnController.register)


export default router;