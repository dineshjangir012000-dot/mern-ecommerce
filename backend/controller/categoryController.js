
import { categoryModel } from "../model/categoryModel.js";
import slugify from "slugify";


export const createCategory = async (req, res ) => {
    try {
        const {name, isActive = true} = req.body;
        if(!name){
            return res.status(400).json({
                status : false,
                message : " Category Name is required"
            })
        }

        const existingCategory = await categoryModel.findOne({name : {$regex : `^${name}$`, $options : `i`}});
        if(existingCategory){
            return res.status(400).json({
                status : false,
                message : "Category already exist"
            })
        } 
        const image = req.file ? req.file.path : null ;

        const category = await categoryModel.create({
            name,
            slug : slugify(name, {lower : true, strict : true}),
            image,
            isActive
        })
        return res.status(201).json({
            status : true,
            message : "Category create successfully",
            data : category
        })

    } catch (error) {
        console.log("Error in creating category", error)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}

export const getAllCategories = async (req, res) => {
    try {
        const allcategories = await categoryModel.find({isActive : true}).sort({name : 1});

        return res.status(200).json({
            status : true,
            messgae : "Fetched all categories",
            data : allcategories
        })
    } catch (error) {
        console.log("Error in getting all categories", error)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const {id} = req.params;
        console.log("id", id)
        console.log("Category id", req.params.id)
        const {name , isActive} = req.body;

        const category = await categoryModel.findById(id);
        if(!category){
            return res.status(400).json({
                status : false ,
                message : "Category not found with this object id"
            })
        }

        const existingCategory = await categoryModel.findOne({
            name : {$regex : `^${name}$`, $options : "i"},
            _id : {$ne : id }
        })
        if(existingCategory){
            return res.status(400).json({
                status : false ,
                message : "Category name is already exist"
            })
        }

        category.name = name
        category.slug = slugify(name, {lower : true, strict : true})

        if(req.file){
            category.image = req.file.path;
        }

        if(typeof isActive === "boolean"){
            category.isActive = isActive
        }

        await category.save() ;

        return res.status(200).json({
            status : true,
            message : "category updated successfully",
            data : category
        })

    } catch (error) {
        console.log("Error in updating category", error)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const {id} = req.params;

        const category = await categoryModel.findById(id)
        if(!category){
            return res.status(400).json({
                status : false ,
                message : "Category not found"
            })
        }
        return res.status(200).json({
            status : true,
            message : "found caregory bit id",
            data: category
        })

    } catch (error) {
        console.log("Error in get category by id", error)
        return req.status(500).json({
            status : false ,
            message : "internal server error"
        })
    }
}

export const deleteCategoryById = async (req, res) => {
    try {
        const {id} = req.params;

        const category = await categoryModel.findById(id)
        if(!category){
            return res.status(400).json({
                status : false ,
                message : "category not found "
            })
        }
        
        category.isActive = false;

        await category.save();
         
        return res.status(200).json({
            status : true,
            message : "category deactived successfully",
            data : category
        })
    } catch (error) {
        console.log("error in deleting category", error)
        return res.status(500).json({
            status : false ,
            message : "internal server error"
        })
    }
}