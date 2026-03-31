import express from "express"
import { verifyToken } from "../../middleware/authMiddleware.js";
import { isAdmin } from "../../middleware/adminMiddleware.js";
import { getAllPaymentsAdmin, getPaymentByIdAdmin, getRevenueSummaryAdmin, refundPaymentAdmin } from "../../controller/admin/adminPaymentController.js";


const router = express.Router();


router.get("/getAllPaymentsAdmin", verifyToken, isAdmin, getAllPaymentsAdmin)
router.get("/getPaymentByIdAdmin/:id", verifyToken, isAdmin, getPaymentByIdAdmin)
router.get("/refundPaymentAdmin/:id", verifyToken, isAdmin, refundPaymentAdmin)
router.post("/getRevenueSummaryAdmin", verifyToken, isAdmin, getRevenueSummaryAdmin);


export default router;