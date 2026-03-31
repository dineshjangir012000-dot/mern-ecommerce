import express from "express"
import {verifyToken} from "../../middleware/authMiddleware.js"
import {isAdmin} from "../../middleware/adminMiddleware.js"
import { getAllOrdersAdmin, getOrderByAdmin, updateOrderStatusAdmin } from "../../controller/admin/adminOrderController.js";


const router = express.Router();


router.get("/getAllOrdersAdmin", verifyToken, isAdmin, getAllOrdersAdmin);
router.get("/getOrderByAdmin/:id", verifyToken, isAdmin, getOrderByAdmin)
router.put("/updateOrderStatusAdmin/:id", verifyToken, isAdmin, updateOrderStatusAdmin);

export default router