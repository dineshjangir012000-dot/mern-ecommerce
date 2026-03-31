import express from "express"
import { addToCart, clearCart, getCart, removeFromCart, updateQuantity } from "../controller/cartController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addToCart", verifyToken , addToCart)
router.get("/getCart", verifyToken, getCart)
router.put("/updateQuantity", verifyToken, updateQuantity);
router.delete("/removeFromCart/:productId", verifyToken, removeFromCart);
router.delete("/clearCart", verifyToken, clearCart);

export default router;