import express from "express"
import { deleteProduct, getAllProducts, getProductById, register, updateProductById } from "../controller/productController.js";
import { uploadProductImages } from "../middleware/multer.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", uploadProductImages.array("images", 5), verifyToken, isAdmin , register)
router.get("/getAllProducts", getAllProducts);
router.get("/getProductById/:id", getProductById)
router.put("/updateProductById/:id",   uploadProductImages.array("images", 5), verifyToken, isAdmin, updateProductById)
router.delete("/deleteProduct/:id",verifyToken, isAdmin,  deleteProduct)


export default router;