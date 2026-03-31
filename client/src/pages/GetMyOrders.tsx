import { API_BASE_URL } from "@/config/apiHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const GetMyOrders = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const token = localStorage.getItem("token");


  const fetchOrders = async () => {
    try {
       const res = await axios.get(`${API_BASE_URL}/api/order/getMyOrders`, {headers : {Authorization : `Bearer ${token}`}}) 
       console.log("response of all order's", res);
       
       if(res.data.status){
        setOrders(res.data.data);
       }
    } catch (error) {
        console.log("Error in fetching all order's", error.message || "Somthing went wrong in fetchig order's")
    }finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-gray-500 mt-1">
          View your complete order history
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* Left Section */}
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Order ID
              </p>
              <p className="font-semibold">
                {order._id}
              </p>

              <p className="text-sm text-gray-500">
                Date: {order.createdAt}
              </p>

              <p className="text-sm text-gray-500">
                Items: {order.items.length}
              </p>
            </div>

            {/* Status */}
            {/* <div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  order.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div> */}

            {/* Right Section */}
            <div className="flex flex-col items-end gap-3">
              <p className="text-lg font-bold">
                ₹{order.totalAmount}
              </p>

              <button
                onClick={() => navigate(`/my-order/${order._id}`)}
                className="px-4 py-2 bg-black text-white rounded-md text-sm hover:font-bold "
              >
                View Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          You have not placed any orders yet.
        </div>
      )}
    </div>
  );
};

export default GetMyOrders;
