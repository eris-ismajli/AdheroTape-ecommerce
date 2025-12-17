import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import { clearCart } from "../store/cart/actions";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import ShippingStep from "../components/checkout/ShippingStep";
import PaymentStep from "../components/checkout/PaymentStep";
import SuccessStep from "../components/checkout/SuccessStep";
import { stripePromise } from "../utils/stripe";

const appearance = {
  theme: "night", // built-in dark theme
  variables: {
    colorPrimary: "#FBBF24", // yellow-amber text/buttons
    colorBackground: "#0b0f17", // dark background
    colorText: "#F3F4F6", // light text
    colorDanger: "#EF4444", // red errors
    fontFamily: '"Inter", sans-serif',
    spacingUnit: "4px",
    borderRadius: "12px",
  },
  rules: {
    ".Input": {
      backgroundColor: "rgba(255,255,255,0.05)",
      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
      color: "#F3F4F6",
    },
    ".Label": {
      color: "#9CA3AF", // placeholder label color
    },
    ".Input:focus": {
      borderColor: "#3B82F6", // blue highlight
      boxShadow: "0 0 0 2px rgba(59,130,246,0.3)",
    },
    ".Tab": {
      backgroundColor: "#1F2937",
      color: "#F3F4F6",
    },
  },
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items || []);
  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price_raw.replace(/[^0-9.]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState(() => {
    const saved = localStorage.getItem("guestShipping");
    return saved ? JSON.parse(saved) : {};
  });

  const [clientSecret, setClientSecret] = useState(null);

  const next = async () => {
    if (step === 1) {
      localStorage.setItem("guestShipping", JSON.stringify(shippingData));

      const { data } = await axios.post(
        "/api/checkout/create-checkout-session",
        {
          items: cartItems,
          shipping_address: shippingData,
        }
      );

      setClientSecret(data.clientSecret);

      // Only advance step after clientSecret is ready
      setStep((s) => s + 1);
      return;
    }
    setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-black text-white flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex justify-between text-sm text-gray-400">
          {["Shipping", "Payment", "Complete"].map((label, i) => (
            <span
              key={label}
              className={step === i + 1 ? "text-blue-400 font-semibold" : ""}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>

        {step === 1 && (
          <ShippingStep
            data={shippingData}
            setData={setShippingData}
            onNext={next}
            onBack={() => navigate("/cart")}
          />
        )}

        {step === 2 && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance }}
          >
            <PaymentStep
              shippingData={shippingData}
              cartItems={cartItems}
              total={total}
              onBack={back}
              onSuccess={next}
            />
          </Elements>
        )}

        {step === 3 && <SuccessStep />}
      </div>
    </div>
  );
};

/* -----------------------------
   Stripe Wrapper
----------------------------- */
export default CheckoutPage;
