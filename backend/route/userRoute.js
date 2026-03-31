import express from "express";
import { deleteUser, forgetPassword, logIn, resetPassword, signUp, updateUser } from "../controller/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/logIn", logIn)

router.put("/updateUser/:id", verifyToken, updateUser);
router.delete("/deleteUser/:id", verifyToken, deleteUser)

router.post("/forgetPassword", forgetPassword)
router.post("/resetPassword", resetPassword)

export default router;
