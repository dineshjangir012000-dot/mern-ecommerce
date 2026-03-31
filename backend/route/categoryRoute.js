import express from "express";
import { createCategory, deleteCategoryById, getAllCategories, getCategoryById, updateCategory } from "../controller/categoryController.js";
import { uploadProductImages } from "../middleware/multer.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/createCategory", uploadProductImages.single("image"), verifyToken, isAdmin, createCategory)
router.get("/getAllCategories", getAllCategories)
router.get("/getCategoryById/:id", getCategoryById)
router.put("/updateCategory/:id", verifyToken, isAdmin, updateCategory)
router.delete("/deleteCategoryById/:id", verifyToken, isAdmin, deleteCategoryById)

export default router;