import express from "express";
import { confirmPayment, createPaymentIntent, failPayment, refundPayment } from "../controller/paymentCantroller.js";
import {verifyToken} from  "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/create-intent", verifyToken, createPaymentIntent);
router.post("/confirmpayment" , verifyToken, confirmPayment);
router.post("/failPayment", verifyToken, failPayment);
router.post("/refundPayment", verifyToken, refundPayment);

export default router;