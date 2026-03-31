import express from "express"
import { verifyToken } from "../../middleware/authMiddleware.js";
import { isAdmin } from "../../middleware/adminMiddleware.js";
import { getDashboardStats, getRecentOrders } from "../../controller/admin/adminDashboardController.js";

const router = express.Router();


router.get("/stats", verifyToken, isAdmin, getDashboardStats)
router.get("/recent-orders", verifyToken, isAdmin, getRecentOrders)


export default router;