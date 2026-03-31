import express from "express"
import { verifyToken } from "../../middleware/authMiddleware.js";
import { isAdmin } from "../../middleware/adminMiddleware.js";
import { createProductAdmin, deleteProductAdmin, getAllProductsAdmin, getProductByIdAdmin, restoreProductAdmin, updateProductAdmin } from "../../controller/admin/adminProductController.js";

const router = express.Router();

router.get("/getAllProductsAdmin", verifyToken, isAdmin, getAllProductsAdmin)
router.post("/createProductAdmin", verifyToken, isAdmin, createProductAdmin)
router.put("/updateProductAdmin/:id", verifyToken, isAdmin, updateProductAdmin)
router.delete("/deleteProductAdmin/:id", verifyToken, isAdmin, deleteProductAdmin)
router.put("/restoreProductAdmin/:id", verifyToken, isAdmin, restoreProductAdmin);
router.get("/getProductByIdAdmin/:id", verifyToken, isAdmin, getProductByIdAdmin);

export default router;