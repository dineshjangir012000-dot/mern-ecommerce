import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Order",
        required : true,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    amount : {
        type : Number,
        required : true,
    },
    provider : {
        type : String ,
        enum : ["STRIPE", "RAZORPAY"],
        default : "STRIPE"
    },
    status : {
        type : String ,
        enum : ["PENDING", "PAID", "FAILED", "REFUNDED"],
        default : "PENDING"
    },
    stripe : {
        paymentIntentId : String ,
        chargedId : String,
    },
    paidAt : Date,
    refundedAt : Date ,
}, {timestamps : true});


const paymentModel = mongoose.model("Payment", paymentSchema)

export default paymentModel;
