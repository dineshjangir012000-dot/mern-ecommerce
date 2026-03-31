import mongoose from "mongoose";
import orderModel from "../model/orderModel.js";


export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const {items} = req.body;

        if (!items || items.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Cart is empty",
      });
    } 

        const subTotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );
        const shippingCharge = subTotal < 999 ? 99 : 0;

        const totalAmount = subTotal + shippingCharge ;

        const order = await orderModel.create({
            user : userId,
            items,
            subTotal,
            shippingCharge,
            totalAmount ,
            orderStatus : "CREATED"
        })

        return res.status(201).json({
            status : true ,
            message : "Order created successfully", 
            data : order
        })

    } catch (error) {
        console.log("GEtting error in creating order", error.message )
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}

export const getMyOrderById = async (req, res) => {
    try {
        const {orderId} = req.params;
        const userId = req.user._id;

        if(!mongoose.Types.ObjectId.isValid(orderId)){
            return res.status(400).json({
                status : false ,
                message : "Invalid order Id"
            })
        }

        const getMyOrder = await orderModel.findOne({_id : orderId , user : userId}).populate("items.product")
        if(!getMyOrder){
            return res.status(404).json({
                status : false ,
                message : "order not found"
            })
        }

        return res.status(200).json({
            status : true ,
            message : "Order get successfully by Id",
            data : getMyOrder 
        })

    } catch (error) {
        console.log("Error in getting order by Id" , error.message)
        return res.status(500).json({
            status : false ,
            message : "Internal server error "
        })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await orderModel.find({user : userId}).sort({createdAt : -1}).populate("items.product")
        return res.status(200).json({
            status : true ,
            message : "Got all order's successfully", 
            data : orders
        })
    } catch (error) {
        console.log("Error in getting all order's", error.message )
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}