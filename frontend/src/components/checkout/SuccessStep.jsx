import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuccessStep = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="pointer-events-none absolute top-0 left-40 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="rounded-2xl border border-white/5 bg-black/80 shadow-[0_0_40px_rgba(0,0,0,0.6)] p-10 space-y-6 transition-all duration-300 hover:shadow-3xl hover:shadow-black/40">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <CheckCircle color="white" size={18} />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Payment Successful
              </h2>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
          </div>
        </div>

        <p className="text-gray-300 text-md md:text-lg">
          Thank you for your purchase. A receipt has been sent to your email.
        </p>

        <div className="pt-4">
          <button onClick={() => navigate("/shop")} className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/25 hover:from-yellow-400 hover:to-amber-400 transition-all duration-200 active:scale-[0.98]">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;
