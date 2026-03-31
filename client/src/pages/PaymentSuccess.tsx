import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const {state} = useLocation()
  const orderId  = state?.orderId

  if (!orderId) {
    return <p className="text-center mt-10">Order not found</p>;
  }

  return (

    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>

      <button
        onClick={() => navigate(`/my-order/${orderId}`)}
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        View My Order
      </button>

      <button
        onClick={() => navigate("/my-orders")}
        className="px-6 py-3 bg-gray-700 text-white rounded-lg"
      >
        View Order History
      </button>
    </div>
  );
};

export default PaymentSuccess;
