import mongoose from "mongoose";
import { categoryModel } from "../../model/categoryModel.js";


export const getAllCategoriesAdmin = async (req, res) => {
    try {
        const {page=1, limit = 10, search, status} = req.query;

        const skip = (page-1) * limit

        const filter = {}

        if(search){
            filter.name = {$regex : search, $options : "i"}
        }

        if(status === "active"){
            filter.isActive = true
        }
        if(status === "inactive") {
            filter.isActive = false 
        }

        const categories = await categoryModel.find(filter)
              .sort({createdAt : -1})
              .skip(skip)
              .limit(Number(limit))

        const totalCategories = await categoryModel.countDocuments(filter)

        return res.status(200).json({
            status : true,
            message : "fetch all categories successfully admin",
            pagination : {
                totalCategories,
                currentPage : Number(page),
                totalPages : Math.ceil(totalCategories / limit)
            },
            data : categories
        })
    } catch (error) {
        console.log("error in get all categories admin ", error.message)
        return res.status(500).json({
            status : false ,
            message : "internal server error"
        })
    }
}


export const createCategoryAdmin = async (req, res) => {
    try {
        const {name} = req.body;
        if(!name) {
            return res.status(400).json({
                status : false ,
                message : "Name is required"
            })
        }

        const exsitingCategory = await categoryModel.findOne({
            name : {$regex : `^${name}$`, $options : "i"}
        })
        if(exsitingCategory) {
            return res.status(400).json({
                status : false ,
                message : "Category is already exsit "
            })
        }

        const category = await categoryModel.create({
            name ,
            slug : slugify(name, {lower: true, strict: true}),
            isActive : true
        })

        return res.status(200).json({
            status : true,
            message : "admin Category created successfully",
            data : category
        })
    } catch (error) {
        console.log("error in create category admin ", error.message)
        return res.status(500).json({
            status : false ,
            message : "internal server error"
        })
    }
}

export const updateCategoryAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        const {name , isActive} = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                status : false ,
                message : "Invalid category id"
            })
        }

        const category = await categoryModel.findById(id)
        if(!category){
            return res.status(400).json({
                status : false ,
                message : "category not found"
            })
        }

        if(name){
            const duplicate = await categoryModel.findOne(name)

            if(duplicate){
                return res.status(400).json({
                    status : false ,
                    message : "category name is already exists"
                })
            }
        }

        category.name = name;
        category.slug = slugify(name, {lower : true, strict : true})

        if(typeof isActive === "boolean"){
            category.isActive = isActive
        }

        await category.save();

        return res.status(200).json({
            status : true ,
            message : "Category updated successfully",
            data : category
        })
    } catch (error) {
        console.log("error in update category admin:", error.message)
        return res.status(500).json({
            status : false ,
            message : "internal server error"
        })
    }
}

export const deactivateCategoryAdmin = async (req, res) => {
    try {
        const {id} = req.params;

        const category = await categoryModel.findByIdAndUpdate(
            id,
            {isActive : false },
            {new : true}
        )
        if(!category) { 
            return res.status(400).json({
                status : false ,
                message : "category not found"
            })
        }

        return res.status(200).json({
                status : true ,
                message : "category deactivated successfully",
                data : category
            })
    } catch (error) {
        console.log("error in deactivate category admin:", error.message)
        return res.status(500).json({
            status : false ,
            message : "internal server error"
        })
    }
}

export const restoreCategoryAdmin = async (req, res) => {
    try {
        const {id} = req.params;

        const category = await categoryModel.findByIdAndUpdate(
            id,
            {isActive : true },
            {new : true}
        )
        if(!category) { 
            return res.status(404).json({
                status : false ,
                message : "category not found"
            })
        }

        return res.status(200).json({
                status : true ,
                message : "category restored successfully",
                data : category
            })
    } catch (error) {
        console.log("error in restore category admin:", error.message)
        return res.status(500).json({
            status : false ,
            message : "internal server error"
        })
    }
}