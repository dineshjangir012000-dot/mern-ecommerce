import express from 'express';
import dotenv from 'dotenv';
import connectDb from './utils/db.js';
import userRoute from "./route/userRoute.js";
import productRoute from "./route/productRoute.js"
import cartRoute from "./route/cartRoute.js"
import categortRoute from "./route/categoryRoute.js"
import paymentRoute from "./route/paymentRoute.js";
import cors from "cors";
import orderRoute from "./route/orderRoute.js"
import path from "path";

import adminAuthRoute from "./route/Admin/adminAuthRoute.js"
import adminDashboardRoutes from "./route/Admin/adminDashboardRoutes.js"
import adminUserRoutes from "./route/Admin/adminUserRoute.js"
import adminProductRoute from "./route/Admin/adminProductRoute.js"
import adminOrderRoute from "./route/Admin/adminOrderRoute.js"
import adminCategoryRoute from "./route/Admin/adminCategoryRoute.js"
import adminPaymentRoute from "./route/Admin/adminPaymentRoute.js"

dotenv.config();

const app = express();




app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:8080",
    "http://localhost:8081",
    "https://mern-ecommerce-phi-five.vercel.app"
  ],
  credentials: true
}));

// app.use(cors({
//   origin: true,
//   credentials: true
// }));


// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api/user',  userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/category", categortRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/order", orderRoute);


app.use("/api/admin", adminAuthRoute)
app.use("/api/admin/dashboard", adminDashboardRoutes)
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/products", adminProductRoute);
app.use("/api/admin/orders", adminOrderRoute);
app.use("/api/admin/categories", adminCategoryRoute);
app.use("/api/admin/payments", adminPaymentRoute)



app.listen(process.env.PORT, (error) => {
    if(!error){
        connectDb();
        console.log(`server is running on port ${process.env.PORT}`);
    } else{
        console.log("Error occurred, server can't start", error);
    }
});