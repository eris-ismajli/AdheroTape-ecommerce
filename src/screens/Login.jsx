import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/auth/actions";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await dispatch(loginUser({ email, password }));
      navigate("/shop");
    } catch (err) {
      // Read message from thrown Error (loginUser already throws proper message)
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-black">
      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8">
        {/* Accent glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-yellow-400/10 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px]" />

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white mb-2">AdheroTape</h1>
          <p className="text-sm text-gray-400">Log in to continue</p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="
                w-full rounded-xl bg-zinc-900/70 border border-white/10
                px-4 py-3 text-sm text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-yellow-400/60
                transition
              "
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="
                w-full rounded-xl bg-zinc-900/70 border border-white/10
                px-4 py-3 text-sm text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-400/50
                transition
              "
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div
              className="
      rounded-lg border border-red-500/30
      bg-red-500/10 text-red-300
      px-4 py-2 text-sm
      flex items-center gap-2
      animate-[fadeIn_0.2s_ease-out]
    "
            >
              <span className="font-medium">Login failed.</span>
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            className="
              w-full mt-2 rounded-xl py-3
              bg-gradient-to-r from-yellow-400 to-yellow-500
              text-black font-semibold
              transition-all duration-300 ease-out
              hover:from-yellow-300 hover:to-yellow-400
              hover:shadow-[0_0_25px_rgba(250,204,21,0.35)]
              active:scale-[0.98]
            "
            onClick={handleSubmit}
          >
            Log In
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
            Continue to shop
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-400 hover:text-yellow-300 transition font-medium"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
