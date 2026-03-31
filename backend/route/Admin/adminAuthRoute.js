import express from "express"
import { adminLogIn, getAdminProfile } from "../../controller/admin/adminAuthController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { isAdmin } from "../../middleware/adminMiddleware.js";

const router = express.Router();


router.post("/login", adminLogIn)
router.get("/me", verifyToken, isAdmin, getAdminProfile)


export default router ;