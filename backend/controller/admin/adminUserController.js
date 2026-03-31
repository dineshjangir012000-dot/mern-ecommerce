
import userModel from "../../model/userModel.js";

export const getAllUsers = async (req,res) => {
    try {
        const {page = 1, limit = 10, search = ""} = req.query ;
        const query = {
            isDeleted : false ,
            $or : [
                {fullName : {$regex : search , $options : "i"}},
                {email : {$regex : search, $options : "i"}}
            ]
        }

        const totalUsers = await userModel.countDocuments(query);

        const users = await userModel.find(query)
              .select("-password -otp -otpExpiry")
              .skip((page-1)*limit)
              .limit(Number(limit))
              .sort({createdAt : -1})

        return res.status(200).json({
            status : true ,
            message : "got all users successfully",
            totalUsers,
            currentPage : Number(page),
            totalPages : Math.ceil(totalUsers / limit),
            data : users
        })      

    } catch (error) {
        console.log("error in getting all users ", error.message)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const {id } = req.params;

        const user = await userModel.findById(id).select("-password -otp -otpExpiry")
        if(!user) {
            return res.status(404).json({
                status : false,
                message : "user not found"
            })
        }

        return res.status(200).json({
            status : true ,
            message : "user get successfully by id ",
            data : user
        })
    } catch (error) {
        console.log("error in getting user by id", error.message )
        return res.status(500).json({
            status : false ,
            message : "internal server error"
        })
    }
}

export const toggleBlockUser = async (req,res) => {
    try {
        const {id} = req.params;

        const user = await userModel.findById(id)
        if(!user){
            return res.status(404).json({
                status : false,
                message : "user not found"
            })
        }

        user.isBlocked = !user.isBlocked
        await user.save();

        return res.status(200).json({
            status : true,
            message : user.isBlocked ? "user blocked successfully" : "user unblocked successfully",
            data : user
        })
    } catch (error) {
        console.log("error in block user", error.message)
        return res.status(500).json({
            status : false,
            message : "internal server error"
        })
    }
}


export const deleteUser = async (req,res) => {
    try {
        const {id} = req.params;

        const user = await userModel.findByIdAndUpdate(
            id,
            {isDeleted : true},
            {new : true},
        )
        if(!user) {
            return res.status(404).json({
                status : false,
                message : "user not found"
            })
        }

        return res.status(200).json({
            status : true,
            message : "user deleted successfully by id",
            data : user
        })
    } catch (error) {
        console.log("erro in deleting user", error.message)
        return res.status(500).json({
            status : false,
            message : "internal server error"
        })
    }
}