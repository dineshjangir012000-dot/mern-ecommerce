import { categoryModel } from "../model/categoryModel.js";
import productModel from "../model/productModel.js";

export const register = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { name, price, description, isStock, category } = req.body;

    const images = req.files?.map((file) => file.path);

    const categoryDoc = await categoryModel.findOne({
      name: { $regex: `^${category}$`, $options: "i" },
      isActive: true,
    });

    if (!categoryDoc) {
      return res.status(400).json({
        status: false,
        message: "category not found",
      });
    }

    if (
      !name ||
      price === undefined ||
      !description ||
      !isStock ||
      category === undefined
    ) {
      return res.status(400).json({
        status: false,
        messgae: "All these fields are required",
      });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        status: false,
        message: "Price must be a positive and valid number",
      });
    }
    const exsitingProduct = await productModel.findOne({
      name,
      isDeleted: false,
    });
    if (exsitingProduct) {
      return res.status(400).json({
        status: false,
        message: "Product already exsit",
      });
    }

    const newProduct = await productModel.create({
      name,
      price,
      description,
      isStock,
      category: categoryDoc._id,
      images,
    });
    return res.status(200).json({
      status: true,
      message: "product registered successfully",
      data: newProduct,
    });
  } catch (error) {
    console.log("Error in registeration", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { category , sort, order} = req.query;
    console.log("category id", category);

    console.log("sort", sort);
    console.log("order", order);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit ;

    let filter = {isDeleted : false };

    if(category) {
      filter.category = category
    }

    let sortOptions = {};

    if (sort){
        sortOptions[sort] = order === "asc" ? 1 : -1
    }
    
    const getAllProducts = await productModel
    .find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

    const totalProducts = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit)

    return res.status(200).json({
      status: true,
      message: "All products get successfully",
      pagination : {
        totalProducts,
        totalPages,
        currentPage : page,
        limit
      },
      count: getAllProducts.length,
      data: getAllProducts,
    });
  } catch (error) {
    console.log("Error in get all products", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    const exsitingProduct = await productModel.findById(id);
    if (!exsitingProduct) {
      return res.status(400).json({
        status: false,
        message: "No product found by this id",
      });
    }
    return res.status(200).json({
      status: true,
      message: "product found successfully",
      data: exsitingProduct,
    });
  } catch (error) {
    console.log("Error in get all product by id", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const images = req.files?.map((file) => file.path);

    const exsitingProduct = await productModel.findById(id, {
      isDeleted: false,
    });
    if (!exsitingProduct) {
      return res.status(400).json({
        status: false,
        message: "product not found by this id",
      });
    }

    const newPrice =
      updateData.price !== undefined
        ? Number(updateData.price)
        : exsitingProduct.price;
    if (isNaN(newPrice) || newPrice <= 0) {
      return res.status(400).json({
        status: false,
        message:
          "New price must be a valid or positive number and must be more than 0",
      });
    }
    const finalUpdatedData = {
      ...updateData,
      price: newPrice,
      ...(images && images.length > 0 && { images }),
    };
    const updatedProducted = await productModel.findByIdAndUpdate(
      id,
      finalUpdatedData,
      { new: true, runValidators: true }
    );
    if (!updatedProducted) {
      return res.status(400).json({
        status: false,
        message: "product not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "product update successfully",
      data: updatedProducted,
    });
  } catch (error) {
    console.log("Error in update product by id", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const exsitingProduct = await productModel.findById(id);
    if (!exsitingProduct) {
      return res.status(400).json({
        status: false,
        message: "No product found by this ID",
      });
    }

    const deletedproduct = await productModel.findByIdAndDelete(
      id,
      { isDeleted: true, isActive: false },
      { new: true }
    );
    if (!deletedproduct) {
      return res.status(400).json({
        status: false,
        message: "product not found so getting error in deleting product",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Product deleted successfully",
      data: deletedproduct,
    });
  } catch (error) {
    console.log("Error in Delete product by id", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
