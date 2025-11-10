import express from "express"
import * as accountController from "../controllers/account.controllers.ts"
import { getUser } from "../controllers/getUser.ts"

const router = express.Router()

router.delete("/:userId",getUser,accountController.deleteUserAccount)


export default router;