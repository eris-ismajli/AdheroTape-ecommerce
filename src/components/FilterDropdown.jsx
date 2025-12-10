const FilterDropdown = ({ label, options }) => {
  return (
    <div className="mb-8">
      <p className="text-sm text-gray-300 mb-3">{label}</p>

      <div className="relative">
        <select
          className="
            w-full bg-black/40 border border-white/10 text-gray-300 
            rounded-xl px-4 py-3 appearance-none cursor-pointer
            focus:outline-none focus:border-blue-400 transition
          "
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-black text-white">
              {opt}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown