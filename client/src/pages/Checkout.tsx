import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiHelper";

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const {state} = useLocation();
  
  const orderId = state?.orderId;

  const token = localStorage.getItem("token");

  const handlePay = async () => {
    if (!stripe || !elements) return;

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await axios.post(
        `${API_BASE_URL}/api/payment/confirmpayment`,
        { paymentIntentId: paymentIntent.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const cartRes = await axios.delete(`${API_BASE_URL}/api/cart/clearCart`,
         {headers : {Authorization : `Bearer ${token}`
      }})

      window.dispatchEvent(new Event ("cart-updated"))
      
      navigate(`/payment-success/`, {
        state : {orderId}
      })

      } catch (error) {
        console.log("Post payment error", error.message)
      }
    }
  };

  if (!orderId) {
    return <p className="text-center mt-10">Invalid checkout session</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <PaymentElement />
      <button
        onClick={handlePay}
        className="mt-4 w-full bg-black text-white py-2 rounded"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;




// const clearCart = async ()=>{
//         const clearres = await axios.delete("http://localhost:3000/api/cart/clearCart" , {headers : {Authorization : `Bearer ${token}`}})
//     }
//       clearCart();