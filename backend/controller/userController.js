import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import sendMail from "../utils/sendMail.js"


import dotenv from 'dotenv'
import { resolveContent } from "nodemailer/lib/shared/index.js";
dotenv.config();
const secret = process.env.JWT_SECRET;


export const signUp = async(req, res) => {
        console.log(req.body);

    try {
        const { fullName, email, password, age, role} = req.body;

        if(!fullName || !email || !password || !age || !role){
            return res.status(400).json({
                status: false,
                message: "All fields are required",
            });
        }

        const existingUser = await userModel.findOne({ email });
        if(existingUser){
            return res.status(400).json({
                status: false,
                message: "User already exists with this email",
            })
        }else{
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = await userModel.create({
                fullName,
                email,
                password: hashPassword,
                age,
                role
            })
            const userResponse = newUser.toObject();
            delete userResponse.password;
            console.log("Userresponse", userResponse);


            return res.status(201).json({
                status: true,
                message: "User registered successfully",
                data: userResponse
            });
        }

    } catch (error) {
        console.log("Error in signup", error);
        return res.status(500).json({
            status: false,
            message: "internal server error",
        });
    }
}

export const logIn = async (req, res) => {
    console.log(req.body);
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                satus : false,
                message: "Email and password both is required"
            })
        }else{
            const existingUser = await userModel.findOne({email : email})
            if(!existingUser){
                return res.status(400).json({
                    status: false,
                    message: "User does not exsit with this mail id"
                })
            }
            
            if(existingUser.isBlocked){
                return res.status(403).json({
                    status : false ,
                    message : "Your account has been blocked by Admin"
                })
            }

            const isMatch = await bcrypt.compare(password, existingUser.password)
            if(!isMatch){
                return res.status(400).json({
                    status : false , 
                    message : "Incorrect password please enter the right password"
                })
            }

            const userResponse = existingUser.toObject();
            delete userResponse.password;

            const token = jwt.sign({_id: userResponse._id, email: userResponse.email, role : userResponse.role}, 
                secret,
                {expiresIn: "24hr"}
            )
            console.log("Token:", token )

            

            return res.status(200).json({
                status : true,
                message : "User logged in successfully",
                token,
                data : userResponse
            })
        }

    } catch (error) {
        console.log("Error in signup", error);
        return res.status(500).json({
            status: false,
            message: "internal server error",
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const {id} = req.params;
    
        if(req.user._id.toString() !== id ){
            return res.status(403).json({
                status : false ,
                message : "You are not allowed to update this user"
            })
        }
        const { fullName, phoneNumber, age} = req.body;

        if(!fullName || !phoneNumber || !age){ 
            return res.status(400).json({
                status : false ,
                message : "Nothing to update"
            })
        }

        const updatedUser = await userModel.findByIdAndUpdate(id,
            {fullName, phoneNumber, age},
            {new : true}
        ).select("-password -otp -otpExpiry");

        return res.status(201).json({
            status : true,
            message : "User updated successfully",
            data : updatedUser
        })
    } catch (error) {
        console.log("Error in updating profile", error)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}


export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params
        if(req.user._id !== id){
            return res.status(403).json({
                status : false ,
                message : "You are not allwed to delete this user"
            })
        }
        const deletedUser = await userModel.findByIdAndDelete(id,
            {isDeleted : true}, 
            {new : true}
        )
        return res.status(200).json({
            status : true,
            message : "user deleted successfullt",
            data : deletedUser
        })

    } catch (error) {
        console.log("Error in deleteing user", error)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}

export const forgetPassword = async (req, res) => {
    try {
        const {email} = req.body;
        if(!email) { 
            return res.status(400).json({
                status : false ,
                message : "Email is required"
            })
        }
        const existingUser = await userModel.findOne({email})
        if(!existingUser){
            return res.status(400).json({
                status : false ,
                message : "User does not exsit with this mail"
            })
        }

        const otp = Math.floor(100000 + (Math.random() * 900000)).toString();
        const otpExpiry = new Date(Date.now() + 5*60*1000);

        existingUser.otp = otp;
        existingUser.otpExpiry = otpExpiry;
        console.log("OTP", otp)
        console.log("OTP EXpiry", otpExpiry)
        await existingUser.save();
        
        const htmlContent = `<h3>PAssword reset otp </h3>
        <p>hi ${existingUser.fullName}</p>
        <p>your OTP for reset password is ${otp}</p>
        <p>This OTP will expire in <b>5 mins </b> </p>
        `

        const sentmail = await sendMail(
            email,
            "Password reset OTP",
            htmlContent
        )
        if(!sentmail){
            return res.status(500).json({
                status : false ,
                message : "Failed to send the OTP on user mail"
            })
        }


        return res.status(200).json({
            status : true,
            message : "OTP sent successfully",
            data : existingUser
        })


    } catch (error) {
        console.log("Error in forget password", error)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}


export const resetPassword = async (req, res) => {
    try {
        const {otp, newPassword, conformPassword } = req.body;
        if(!otp || !newPassword || !conformPassword){
            return res.status(400).json({
                status : false,
                message : "These fields are required"
            })
        }
        const exsitingUser = await userModel.findOne({otp})
        if(!exsitingUser){
            return res.status(400).json({
                status: false,
                message : "User is not exsit with this OTP"
            })
        }

        if(exsitingUser.otp !== otp){
            return res.status(400).json({
                status: false,
                message : "Invalid OTP"
            })
        }

        if(!exsitingUser.otpExpiry || exsitingUser.otpExpiry < new Date()){
            return res.status(400).json({
                status : false ,
                message : "OTP expired please request for new one"
            })
        }

        if(newPassword !== conformPassword){
            return res.status(400).json({
                status : false ,
                message : "Please enter the same password "
            })
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        exsitingUser.password = hashPassword
        exsitingUser.otp = null
        exsitingUser.otpExpiry = null
        await exsitingUser.save();

        return res.status(200).json({
            status: true,
            message : "Password reset successfully",
            data : exsitingUser
        })

    } catch (error) {
        console.log("Error in reset password ", error)
        return res.status(500).json({
            status : false ,
            message: "Internal server error "
        })
    }
}