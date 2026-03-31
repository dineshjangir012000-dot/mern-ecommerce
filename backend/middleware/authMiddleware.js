import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();
const secret = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const authheader = req.headers.authorization
    if(!authheader){
        return res.status(401).json({
            status : false ,
            message : "no token provided in headers"
        })
    }
    const Token = authheader.split(" ")[1]
    if(!Token) {
        return res.status(401).json({
            status : false ,
            message : "Invalid token format"
        })
    }

    try {
        const decoded = jwt.verify(Token, secret)
        req.user = decoded;
        next();
    } catch (error) {
        console.log("error in token verification", error)
        return res.status(401).json({
            status : false ,
            message : "Invalid or expired token"
        })
    }
}
