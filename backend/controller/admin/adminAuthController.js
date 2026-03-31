import userModel from "../../model/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECRET

export const adminLogIn = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
            status : false ,
            message : "email and password is required"
        })
        }

        const admin = await userModel.findOne({email})
        if(!admin){
            return res.status(400).json({
                status : false ,
                message : "Admin not found"
            })
        }

        if(admin.role !== "ADMIN"){
            return res.status(400).json({
                status : false ,
                message : "admin access denied"
            })
        }
        if(admin.isBlocked){
            return res.status(400).json({
                status : false ,
                message : "admin account is blocked"
            })
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        if(!isMatch) { 
            return res.status(400).json({
                status : false ,
                message : "password invalid"
            })
        }

        const adminData = admin.toObject();
        delete adminData.password;

        await adminData.save();

        const token = jwt.sign(
            {
                _id : adminData._id,
                email : adminData.email,
                role : adminData.role
            },
            secret,
            {expiresIn : "7d"},
        )

        return res.status(200).json({
            status : true,
            message : "Admin logged in successfully",
            token,
            data : adminData
        })

    } catch (error) {
        console.log("error in admin log in", error.message)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}

export const getAdminProfile = async (req, res) => {
    try {
        const {id} = req.user._id;

        const admin = await userModel.findById(id).select("-password")

        return res.status(200).json({
            status : true,
            message : "admin profile get successfully",
            data : admin
        })
    } catch (error) {
        console.log("Error in get admin profile", error.message)
        return res.status(500).json({
            status : false ,
            message : "internal server error"
        })
    }
}