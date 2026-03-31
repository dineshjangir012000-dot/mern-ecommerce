import mongoose from "mongoose";
import paymentModel from "../../model/paymentModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const getAllPaymentsAdmin = async (req, res) => {
    try {
        const {page = 1, limit = 10, search, status} = req.query;
        const skip = (page-1)*limit;

        const filter = {}

        if(status){
            filter.status = status
        }

        if(search){
            const users = await mongoose.model("User").find({email : {$regex : search, $options : "i"}}).select("_id")
            const userIds = users.map(user => user._id)

            filter.user = {$in : userIds};
        }

        const payments = await paymentModel.find(filter)
            .populate("user", "fullName, email")
            .populate("order")
            .sort({createdAt: -1})
            .skip(skip)
            .limit(Number(limit))

        const totalPayments = await paymentModel.countDocuments(filter)    

        return res.status(200).json({
            status : true ,
            message : "Get all payments admin successfully",
            pagination : {
                totalPaymets,
                currentPage : Number(page),
                totalPages : Math.ceil(totalPaymets/limit)
            },
            data : totalPayments
        })

    } catch (error) {
        console.log("erro in get all payments admin", error.message)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}

export const getPaymentByIdAdmin = async (req, res) => {
    try {
        const {id} = req.params ;

        const payment = await paymentModel.findById(id).populate("user", "fullname, email").populate("order")

        if(!payment){
            return res.status(404).json({
                status : false ,
                message : "Payment not found admin"
            })
        }

        return res.status(200).json({
            status : true ,
            message : "Payment fetch successfully in admin",
            data : payment
        })

    } catch (error) {
        console.log("erro in get payments by id admin", error.message)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}

export const refundPaymentAdmin = async (req, res) => {
    try {
        const {id} = req.params;

        const payment = await paymentModel.findById(id)
        if(!payment){
            return res.status(404).json({
                status : false ,
                message : "payment not found"
            })
        }

        if(payment.status !== "PAID"){
            return res.status(400).json({
                status : false,
                message : "Only paid payment can be refunded"
            })
        }

        const refundPayment = await stripe.refunds.create({
            payment_intent : payment.stripe.paymentIntentId
        })

        payment.status = "REFUNDED"
        payment.refundedAt = new Date();
        await payment.save();

        return res.status(200).json({
            status : true,
            message : "payment refunded successfully",
            data : refundPayment
        })
    } catch (error) {
        console.log("error in refund payments admin", error.message)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }   
}

export const getRevenueSummaryAdmin = async (req, res) => {
    try {
        const result = await paymentModel.aggregate([
            {$match : {status : "PAID"}},
            {
                $group : {
                    _id : null,
                    totalRevenue: {$sum : "$amount"},
                    totalTransactions : {$sum : 1},
                }
            }
        ])

        return res.status(200).json({
            status : true ,
            message : "revenue summery fetch successfully",
            data : result[0] || {totalRevenue : 0, totalTransactions : 0}
        })
    } catch (error) {
        console.log("error in revenue summery admin", error.message)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}