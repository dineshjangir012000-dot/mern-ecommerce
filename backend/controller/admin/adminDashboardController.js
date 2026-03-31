import userModel from "../../model/userModel.js";
import productModel from "../../model/productModel.js";
import orderModel from "../../model/orderModel.js";
import paymentModel from "../../model/paymentModel.js";
import { categoryModel } from "../../model/categoryModel.js";

export const getDashboardStats = async (req,res) => {
    try {
        const totalUsers = await userModel.countDocuments({isDeleted : false , role : "USER"})

        const totalProducts = await productModel.countDocuments({isDeleted : false }) 

        const totalOrders = await orderModel.countDocuments()
        const pendingorders = await orderModel.countDocuments({orderStatus : "CREATED"})
        const cancelledOrders = await orderModel.countDocuments({orderStatus : "CANCELLED"})

        const totalPayments = await paymentModel.aggregate([
            {$match : {status : "PAID"}},
            {
                $group : {
                    _id : null,
                    totalRevenue : {$sum : "$amount"}
                }
            }
        ]);

        const totalRevenue = totalPayments.length > 0 ? totalPayments[0].totalRevenue : 0;

        const totalCategories = await categoryModel.countDocuments({isActive : true});

        return res.status(200).json({
            status : true ,
            message : "dashboard stats got successfully",
            data : {
                totalUsers,
                totalProducts,
                totalOrders,
                pendingorders,
                cancelledOrders,
                totalRevenue,
                totalCategories
            }
        })

    } catch (error) {
        console.log("erro in get dashboard  stats", error.message)
        return res.status(500).json({
            status : false,
            message : "internal server error"
        })
    }
}

export const getRecentOrders = async (req,res) => {
    try {
        const recentOrders = await orderModel.find()
        .sort({createdAt : -1})
        .limit(5)
        .populate("user", "fullName email")
        .populate("items.product", "name");

        return res.status(200).json({
            status : true,
            message : "got recent orders successfully",
            data : recentOrders
        })
    } catch (error) {
        console.log("Error in getting recent orders", error.message)
        return res.status(500).json({
            status : false ,
            message : "internal server error"
        })
    }
}