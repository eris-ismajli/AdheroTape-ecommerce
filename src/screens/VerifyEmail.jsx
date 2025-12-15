import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

import { useDispatch } from "react-redux";
import { LOGIN_SUCCESS } from "../store/auth/constants";
import { setAuthToken } from "../utils/axiosInstance";

import { Loader2, UserRoundCheck } from "lucide-react";

const VerifyEmail = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Invalid verification session.
      </div>
    );
  }

  const submitCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/auth/verify-email", {
        email,
        code,
      });

      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token: data.token,
          user: data.user,
        },
      });

      setAuthToken(data.token);

      toast(`Welcome, ${data.user.name}`, {
        icon: <UserRoundCheck className="text-green-400" />,
      });

      navigate("/shop");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-black">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Verify your email
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Enter the 6-digit code sent to{" "}
          <span className="text-white">{email}</span>
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={submitCode} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            inputMode="numeric"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="
              w-full rounded-xl bg-zinc-900/70 border border-white/10
              px-4 py-3 text-center tracking-[0.3em] text-lg text-white
              placeholder-gray-500 focus:outline-none
              focus:ring-2 focus:ring-yellow-400/60
            "
          />

          <button
            disabled={loading || code.length !== 6}
            className="
    w-full rounded-xl py-3 bg-gradient-to-r
    from-yellow-400 to-yellow-500 text-black font-semibold
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
  "
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying…
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
