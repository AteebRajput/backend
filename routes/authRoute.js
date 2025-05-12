import express from "express"
import { checkAuth, forgotPassword, loginController, logoutController, resetPassword, signupController, verifyEmail, updateUser, getUserData, getUserName } from "../controller/authController.js"
import {verifyToken} from "../middleware/verifyToken.js"
const router = express.Router()

router.post("/signup", signupController);

router.post("/verify-email",verifyEmail)

router.post("/login",loginController)

router.post("/logout",logoutController)

router.post("/forgot-password",forgotPassword)

router.post("/reset-password/:token", resetPassword);

router.post("/check-auth", verifyToken,checkAuth);

router.put("/update-user",updateUser)

router.get("/getUser",getUserData)

router.get("/getUsername",getUserName)
export default router