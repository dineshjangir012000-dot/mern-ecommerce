import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },phoneNumber: {
        type: String,
    }, age: {
        type: Number,
        required: true
    },isDeleted : {
        type : Boolean,
        default: false
    },isBlocked : {
        type : Boolean,
        default: false
    },otp : {
        type : String,
        default : ""
    },
    otpExpiry : {
        type : Date
    },
    role : {
        type : String,
        enum : ["USER", "ADMIN"],
        required : true,
        default : "USER"
    }
}, {
    timestamps: true
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
