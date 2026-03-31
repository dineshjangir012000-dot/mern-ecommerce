import express from "express"
import { verifyToken } from "../../middleware/authMiddleware.js";
import { isAdmin } from "../../middleware/adminMiddleware.js";
import { deleteUser, getAllUsers, getUserById, toggleBlockUser } from "../../controller/admin/adminUserController.js";

const router = express.Router();

router.get("/getAllUsers", verifyToken, isAdmin, getAllUsers)
router.get("/getUserById/:id", verifyToken, isAdmin, getUserById)
router.put("/toggleBlockUser/:id", verifyToken, isAdmin, toggleBlockUser)
router.delete("/deleteUser/:id", verifyToken, isAdmin, deleteUser)

export default router ;