import mongoose, { mongo } from "mongoose";

const categorySchema = new mongoose.Schema({
    name :{
        type : String,
        required : true,
        unique : true, 
        trim : true
    } ,
    slug : {
        type : String,
        required : true,
        unique : true
    },
    image : {
        type : String,
        default : ""
    },
    isActive : {
        type : Boolean,
        default : true
    }
}, { timestamps : true});


export const categoryModel = mongoose.model("category", categorySchema);