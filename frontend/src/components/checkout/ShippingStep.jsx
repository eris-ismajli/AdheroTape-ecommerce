import { ChevronLeft, ChevronRight, Home } from "lucide-react";

const ShippingStep = ({ data, setData, onNext, onBack }) => {
  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const inputFields = [
    { id: "fullName", label: "Full Name", required: true },
    { id: "email", label: "Email", type: "email", required: true },
    {
      id: "address",
      label: "Address",
      required: true,
      colSpan: "md:col-span-2",
    },
    { id: "city", label: "City", required: true },
    { id: "state", label: "State / Province", required: true },
    { id: "zip", label: "ZIP / Postal Code", required: true },
    { id: "country", label: "Country", required: true },
  ];

  const isFormValid = () => {
    const requiredFields = inputFields.filter((field) => field.required);
    return requiredFields.every((field) => data[field.id]?.trim().length > 0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-2xl border border-white/5 bg-black/80 shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8 space-y-8 shadow-black/30 transition-all duration-300 hover:shadow-3xl hover:shadow-black/40">
        {/* Header with progress indicator */}
        <div className="pointer-events-none absolute top-0 left-60 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 right-60 w-[450px] h-[450px] bg-green-300/5 rounded-full blur-[120px]" />

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Home color="black" size={18} />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Shipping Information
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Step 1 of 3 • Enter your delivery details
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {inputFields.map(
            ({ id, label, type = "text", required, colSpan }) => (
              <div key={id} className={`space-y-2 ${colSpan || ""}`}>
                <label className="block text-sm font-medium text-gray-300">
                  {label}
                </label>
                <div className="relative group">
                  <input
                    name={id}
                    type={type}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    value={data[id] || ""}
                    onChange={handleChange}
                    required={required}
                    className="
    w-full p-4 rounded-xl
    bg-gray-900/40 border border-gray-700/50
    text-white placeholder-gray-500
    shadow-inner backdrop-blur-sm
    transition-all duration-300 ease-in-out
    outline-none focus:border-blue-500
    hover:border-gray-600
  "
                  />
                </div>
              </div>
            )
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 pt-6 border-t border-gray-800/50">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/60 text-gray-300 font-medium hover:bg-gray-700/80 hover:text-white transition-all duration-200 active:scale-[0.98] group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <button
            onClick={onNext}
            disabled={!isFormValid()}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300
  ${
    isFormValid()
      ? "bg-gradient-to-r from-green-500 to-green-400 text-black shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/25 hover:from-green-400 hover:to-green-300 active:scale-[0.98]"
      : "bg-gray-800/40 text-gray-500 cursor-not-allowed border border-gray-700/50"
  }`}
          >
            Continue to Payment
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Form validation hint */}
        {!isFormValid() && (
          <div className="flex items-center gap-2 text-sm text-amber-400/80 animate-pulse">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.406 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span>Please fill in all required fields to continue</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingStep;
