import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb =  async() => {
    const connectionDb = await mongoose.connect(process.env.MONGODB_URL)   
    if(connectionDb){
        console.log("Database connected successfully");
    } else {
        console.log("Database connection failed");
    }
};

export default connectDb;
