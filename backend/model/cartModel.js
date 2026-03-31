import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    items: [
        {
            productId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "product"
            },
            quantity : {
                type : Number,
                default : 1, 
                min : 1
            }
        }
    ]
}, {timestamps : true});


const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;