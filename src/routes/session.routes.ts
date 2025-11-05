import express from "express";
import * as sessionController from "../controllers/session.controllers.ts"
import authenticate from "../middlewares/auth.ts";

const router = express.Router()

router.get("/get-sessions",authenticate,sessionController.sessions)
router.delete("/revoke-sessions/:sessionId",authenticate,sessionController.revokeSession)

export default router