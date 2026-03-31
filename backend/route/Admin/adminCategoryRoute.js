import express from "express"
import {verifyToken} from "../../middleware/authMiddleware.js"
import { isAdmin } from "../../middleware/adminMiddleware.js";
import { createCategoryAdmin, deactivateCategoryAdmin, getAllCategoriesAdmin, restoreCategoryAdmin, updateCategoryAdmin } from "../../controller/admin/adminCategoryController.js";


const router = express.Router();

router.get("/getAllCategoriesAdmin", verifyToken, isAdmin, getAllCategoriesAdmin)
router.post("/createCategoryAdmin", verifyToken, isAdmin, createCategoryAdmin)
router.put("/updateCategoryAdmin/:id", verifyToken, isAdmin, updateCategoryAdmin)
router.put("/deactivateCategoryAdmin/:id", verifyToken, isAdmin, deactivateCategoryAdmin)
router.put("/restoreCategoryAdmin/:id", verifyToken, isAdmin, restoreCategoryAdmin)


export default router ;