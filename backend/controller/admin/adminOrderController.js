import mongoose from "mongoose";
import orderModel from "../../model/orderModel.js";
import userModel from "../../model/userModel.js";

export const getAllOrdersAdmin = async (req, res) => {
    try {
        const {page = 1, limit = 10, status , search} = req.body;
        const skip = (page - 1) * limit;

        const filter = {} ;

        if(status) {
            filter.orderStatus = status
        }

        if(search) {
            const users = await userModel.find({
                email : {$regex : search, $options : "i"}
            }).select("_id")

            const userIds = users.map(user => user._id)
            filter.user = {$in : userIds};
        }

        const orders = await orderModel.find(filter)
             .populate("user", "fullname email")
             .populate("items.products")
             .ship(skip)
             .limit(Number(limit))
             .sort({createdAt : -1})

        const totalOrders = await orderModel.countDocuments(filter)
        
        return res.status(200).json({
            status : true ,
            message : "got all order's in admin successfully",
            pagination : {
                totalOrders,
                totalPages : Math.ceil(totalOrders / limit),
                currentPage : Number(page)
            }, 
            data : orders
        })
    } catch (error) {
        console.log("error in getAllordersAdmin", error.message)
        return res.status(500).json({
            status: false ,
            message : "internal server error"
        })
    }
}

export const getOrderByAdmin = async (req, res) => {
    try {
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                status : false,
                message : "Invalid order is"
            })
        }

        const order = await orderModel.findById(id)
                .populate("user", "fullName email")
                .populate("items.product")

        if(!order) {
            return res.status(404).json({
                status: false ,
             message : "order not found"
            })
        }

        return res.status(200).json({
            status:true ,
            message : "Order found by id in admin",
            data : order
        })

    } catch (error) {
        console.log("error in getorderbyAdmin",error.message) 
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}

export const updateOrderStatusAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        const {orderStatus} = req.body;

        const allowedStatuses = ['CREATED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

        if(!allowedStatuses.includes(orderStatus)){
            return res.status(400).json({
                status : false ,
                message : "invalid order status "
            })
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            id,
            {orderStatus},
            {new : true}
        )
        if(!updatedOrder){
            return res.status(400).json({
                status : false ,
                message : "order not found "
            })
        }

        return res.status(200).json({
                status : true ,
                message : "order status updated successfully",
                data : updatedOrder
            })
    } catch (error) {
        console.log("error in update Order Status Admin",error.message) 
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}