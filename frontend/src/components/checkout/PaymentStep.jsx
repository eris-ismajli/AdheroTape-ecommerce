import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { clearCart } from "../../store/cart/actions";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
} from "lucide-react";
import axios from "axios";

const PaymentStep = ({ shippingData, cartItems, total, onBack, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      console.error("Stripe.js has not loaded yet.");
      toast.error("Stripe is not ready. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          receipt_email: shippingData.email,
        },
        redirect: "if_required",
      });

      if (result.error) {
        console.error(result.error);
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      await axios.post("/api/checkout/confirm-order", {
        orderId: result.paymentIntent.id,
        items: cartItems,
        total,
        shippingAddress: shippingData,
        email: shippingData.email,
        paymentMethod: "Credit Card",
      });

      // Send receipt email
      await axios.post("/api/checkout/send-receipt", {
        orderId: result.paymentIntent.id,
        items: cartItems,
        total,
        shippingAddress: shippingData,
        email: shippingData.email,
        customerName: shippingData.fullName,
        paymentMethod: "Credit Card",
      });

      dispatch(clearCart());
      toast("Payment successful!", {
        icon: <Check className="text-green-400" />,
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 w-[400px] h-[400px] bg-green-300/5 rounded-full blur-[120px]" />

      {/* Card */}
      <div className="rounded-2xl border border-white/5 bg-black/50 shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8 space-y-8 transition-all duration-300 hover:shadow-3xl hover:shadow-black/40">
        {/* Heading */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <CreditCard color="black" size={18} />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Secure Payment
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Step 2 of 3 • Enter your payment details
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
          </div>
        </div>

        {/* Stripe Element */}
        <form onSubmit={handlePay} className="space-y-6">
          <div className="rounded-xl border border-gray-700/50 bg-black/50 p-6 duration-300">
            <PaymentElement />
          </div>

          <p className="text-sm text-gray-400 text-center">
            🔒 Payments are encrypted and securely processed
          </p>

          {/* Action Buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/60 text-gray-300 font-medium hover:bg-gray-700/80 hover:text-white transition-all duration-200 active:scale-[0.98] group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
              ${
                !loading
                  ? "bg-gradient-to-r from-green-500 to-green-400 text-black shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/25 hover:from-green-400 hover:to-green-300 active:scale-[0.98]"
                  : "bg-gray-800/40 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Processing…" : `Pay $${total.toFixed(2)}`}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentStep;
