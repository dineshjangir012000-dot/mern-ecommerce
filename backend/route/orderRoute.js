import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createOrder, getMyOrderById, getMyOrders } from "../controller/orderController.js";


const router = express.Router();

router.post("/createOrder", verifyToken, createOrder)
router.get("/getMyOrderById/:orderId", verifyToken, getMyOrderById)
router.get("/getMyOrders", verifyToken, getMyOrders)


export default router;