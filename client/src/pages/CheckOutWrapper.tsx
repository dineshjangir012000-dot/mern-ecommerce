import { Elements } from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";
import { stripePromise } from "../stripe";
import Checkout from "./Checkout";

const CheckoutWrapper = () => {
  const { state } = useLocation();
  const clientSecret = state?.clientSecret;

  if (!clientSecret) {
    return (
      <div className="text-center mt-10 text-red-500">
        Invalid or expired payment session
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <Checkout />
    </Elements>
  );
};

export default CheckoutWrapper;
