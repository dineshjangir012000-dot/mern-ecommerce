import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute ({children}) {
    const token = localStorage.getItem("admintoken")
    const admin = JSON.parse(localStorage.getItem("admin"))

    console.log("Admin", admin)
    console.log("token", token)


    if(!token || !admin || admin.role !== "ADMIN"){
        console.log("redirecting to log in")
        return <Navigate to="/admin/login" replace />;
    }

    return children
}