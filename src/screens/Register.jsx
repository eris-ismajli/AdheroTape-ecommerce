import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/auth/actions";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await dispatch(registerUser({ name, email, password }));
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      const message = err.response?.data?.message;

      if (message?.toLowerCase().includes("email")) {
        setErrors({ email: message });
      } else if (message?.toLowerCase().includes("password")) {
        setErrors({ password: message });
      } else {
        setErrors({ general: message || "Registration failed" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-black">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8">
        {/* Accent glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 bg-yellow-400/10 rounded-full blur-[120px]" />

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Create account
          </h1>
          <p className="text-sm text-gray-400">Join us in a few seconds</p>
        </div>

        {errors.general && (
          <div
            className="
    mb-4 rounded-lg border border-red-500/30
    bg-red-500/10 text-red-300
    px-4 py-2 text-sm
    animate-[fadeIn_0.2s_ease-out]
  "
          >
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" autoComplete="off">
          {/* Chrome autofill trap */}
          <input
            type="text"
            name="username"
            autoComplete="username"
            className="hidden"
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            className="hidden"
          />

          {/* Name */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className={`
    w-full rounded-xl bg-zinc-900/70 px-4 py-3 text-sm
    text-white placeholder-gray-500 transition focus:outline-none
    ${
      errors.name
        ? "border border-red-500/50 focus:ring-2 focus:ring-red-500/40"
        : "border border-white/10 focus:ring-2 focus:ring-blue-400/50"
    }
  `}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: null }));
              }}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Email
            </label>
            <input
              autoComplete="new-email"
              type="email"
              placeholder="you@example.com"
              className={`
    w-full rounded-xl bg-zinc-900/70 px-4 py-3 text-sm
    text-white placeholder-gray-500 transition focus:outline-none
    ${
      errors.email
        ? "border border-red-500/50 focus:ring-2 focus:ring-red-500/40"
        : "border border-white/10 focus:ring-2 focus:ring-yellow-400/60"
    }
  `}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: null }));
              }}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Password
            </label>
            <input
              autoComplete="new-password"
              type="password"
              placeholder="••••••••"
              className={`
    w-full rounded-xl bg-zinc-900/70 px-4 py-3 text-sm
    text-white placeholder-gray-500 transition focus:outline-none
    ${
      errors.password
        ? "border border-red-500/50 focus:ring-2 focus:ring-red-500/40"
        : "border border-white/10 focus:ring-2 focus:ring-blue-400/50"
    }
  `}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((p) => ({ ...p, password: null }));
              }}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
    w-full mt-2 rounded-xl py-3
    flex items-center justify-center gap-2
    font-semibold
    transition-all duration-300 ease-out
    ${
      isSubmitting
        ? "bg-yellow-400/70 cursor-not-allowed"
        : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 hover:shadow-[0_0_25px_rgba(250,204,21,0.35)]"
    }
    text-black
    active:scale-[0.98]
  `}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                Creating account…
              </>
            ) : (
              "Register"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="
    w-full mt-3 rounded-xl py-3
    border border-white/15
    text-white text-sm font-medium
    transition-all duration-300
    hover:bg-white/5 hover:border-white/30
    active:scale-[0.98]
  "
          >
            Continue as Guest
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-400 hover:text-yellow-300 transition font-medium"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
