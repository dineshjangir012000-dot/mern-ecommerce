import {categoryModel}  from "../../model/categoryModel.js";
import productModel from "../../model/productModel.js";


export const getAllProductsAdmin = async (req,res) => {
    try {
        const {page = 1, limit = 10, search, status, deleted} = req.query;

        const skip = (page-1) * limit ;
        
        const filter = {} ;

        if(search) {
            filter.name = {$regex : search, $options : "i"}
        }

        if(status === "active"){
            filter.isactive = true
        }
        if(status === "isactive"){
            filter.isactive = false
        }
        if(deleted === true){
            filter.isDeleted = true
        }
        if(deleted === false){
            filter.isDeleted = false
        }

        const products = await productModel.find(filter)
             .skip(skip)
             .populate("category")
             .limit(Number(limit))
             .sort({createdAt : -1})
             
        const totalProducts = await productModel.countDocuments(filter);


        return res.status(200).json({
            status : true,
            message : "get all products successfully",
            pagination : {
                totalProducts,
                totalPages : Math.ceil(totalProducts / limit),
                currentPage : Number(page)
            },
            data : products
        });

    } catch (error) {
        console.log("error in get all products", error.message)
        return res.status(500).json({
            status : false,
            message : "internal server error"
        })
    }
}

export const createProductAdmin = async (req, res) => {
    try {
        const {name, price, category, description, stock} = req.body;

        if(!name || !price || !category || !description || stock === undefined) {
            return res.status(400).json({
                status : false ,
                message : "name price description category and Stock is required"
            })
        }

        if(isNaN(price) || Number(price) <= 0){
            return res.status(400).json({
                status : false ,
                message : "Invalid price"
            })
        }

        if(stock < 0){
            return res.status(400).json({
                status : false ,
                message : "stock can't be negative"
            })
        }

        const categoryDocs = await categoryModel.findById(category)
        if(!categoryDocs){
            return res.status(400).json({
                status : false ,
                message : "Category not found"
            })
        }

        const images = req.files?.map(file => file.path)

        const product = await productModel.create({
            name,
            price : Number(price),
            discountedPrice: discountedPrice || 0,
            description,
            category,
            stock,
            isactive : true,
            isDeleted : false 
        })

        return res.status(200).json({
            status : true ,
            message : "product created successfully in admin",
            data : product
        })
    } catch (error) {
        console.log("error in create product in admin", error.message)
        return res.status(500).json({
            status : false,
            message : "internal server error"
        })
    }
}

export const updateProductAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedData = req.body;

        const product = await productModel.findById(id) 
        if(!product){
            return res.status(404).json({
                status : false ,
                message : "product not found"
            })
        }

        if (product.isDeleted) {
            return res.status(400).json({
                status: false,
                message: "Cannot update deleted product",
            });
        }

        

        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            req.body,
            {new : true , runValidators : true}
        )

        return res.status(200).json({
            status : true ,
            message : "product updated successfully",
            data : updatedProduct
        })

    } catch (error) {
        console.log("error in updating product in admin", error.message)
        return res.status(500).json({
            status : false,
            message : "internal server error"
        })
    }
}

export const deleteProductAdmin = async (req, res) => {
    try {
        const {id} = req.params;

        const product = await productModel.findById(id)
        if(!product) {
            return res.status(400).json({
                status : false ,
                message : "product not found"
            })
        }

        const deletedProduct = await productModel.findByIdAndUpdate(
            id,
            {isactive : false , isDeleted : true},
            {new : true }
        ) 
        return res.status(200).json({
            status : true ,
            message : "product soft deleted successfully",
            data : deletedProduct
        })
    } catch (error) {
        console.log("error in deleting product in admin", error.message)
        return res.status(500).json({
            status : false,
            message : "internal server error"
        })
    }
}

export const restoreProductAdmin = async (req, res) => {
    try {
        const {id} = req.body;
        const product = await productModel.findByIdAndUpdate(
            id,
            {isactive : true , isDeleted : false },
            {new : true}
        )

        if(!product) { 
            return res.status(404).json({
                status : false ,
                message : "product not found"
            })
        }

        return res.status(200).json({
            status : true ,
            message : "product restored successfully",
            data : product
        })

    } catch (error) {
        console.log("error in restor product in admin", error.message)
        return res.status(500).json({
            status : false,
            message : "internal server error"
        })
    }
}

export const getProductByIdAdmin = async (req, res) => {
    try {
        const {id} = req.params;

        const product = await productModel.findById(id).populate("category")
        if(!product){
            return res.status(404).json({
                status : false ,
                message : "product not found"
            })
        }

        return res.status(200).json({
            status : true ,
            message : "product get successfully by id",
            data : product
        })
    } catch (error) {
        console.log("error in get product by id admin", error.message)
        return res.status(500).json({
            status : false,
            message : "internal server error"
        })
    }
}