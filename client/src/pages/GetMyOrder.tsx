import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiHelper";
import { getImageUrl } from "@/config/apiHelper";


const GetMyOrder = () => {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState(null);
  const token = localStorage.getItem("token");


  const fetchOrder = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/order/getMyOrderById/${orderId}` , {headers : {Authorization : `Bearer ${token}`}})
        console.log("Response ", res.data.data);

        if(res.data.status){
            setOrder(res.data.data);
        }
    } catch (error) {
        console.log("Something went wrong")
    }finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    if(orderId){
      fetchOrder();
    }
  }, [orderId])
  // ❗ API integration will come later
  // For now, we use dummy data for UI

  if (loading) {
    return <p className="text-center mt-10">Loading order...</p>;
  }
  

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Order</h1>
        <p className="text-gray-500 mt-1">
          Order ID: <span className="font-medium">{order._id}</span>
        </p>
      </div>

      {/* Order Status */}
      <div className="mb-6">
        <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
          {order.paymentStatus}
        </span>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow rounded-lg divide-y">
        {order.items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-6 p-6"
          >
            <img
              src={getImageUrl(item.product.images[0])}
              alt={item.product.name}
              className="w-24 h-24 object-cover rounded"
            />

            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {item.product.name}
              </h2>
              <p className="text-gray-500">
                Quantity: {item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold">
                ₹{item.price * item.quantity}
              </p>
              <p className="text-sm text-gray-400">
                ₹{item.price} each
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
<div className="mt-8 flex justify-end">
  <div className="w-full max-w-sm bg-gray-500 p-6 rounded-lg space-y-3">
    
    {/* Subtotal */}
    <div className="flex justify-between font-semibold text-sm text-gray-200">
      <span>Subtotal</span>
      <span>₹{order.subTotal}</span>
    </div>

    {/* Shipping */}
    <div className="flex justify-between font-semibold text-sm text-gray-200">
      <span>Shipping</span>
      <span>
        {order.shippingCharge > 0 ? `₹${order.shippingCharge}` : "FREE"}
      </span>
    </div>

    <hr className="border-gray-400" />

    {/* Total */}
    <div className="flex justify-between text-lg font-semibold text-white">
      <span>Total</span>
      <span>₹{order.totalAmount}</span>
    </div>

  </div>
</div>

    </div>
  );
};

export default GetMyOrder;

