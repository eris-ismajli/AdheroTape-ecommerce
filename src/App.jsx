import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

import LandingPage from "./LandingPage";
import Shop from "./screens/Shop";
import Cart from "./screens/Cart";
import ProductDetails from "./screens/ProductDetails";
import Wishlist from "./screens/Wishlist";
import Login from "./screens/Login";
import Register from "./screens/Register";
import ScrollToTop from "./utils/scrollToTop";

import { fetchCart } from "./store/cart/actions";
import { fetchWishlist } from "./store/wishlist/actions";
import { setAuthToken } from "./utils/axiosInstance";
import { LogOut, UserRoundCheck } from "lucide-react";
import VerifyEmail from "./screens/VerifyEmail";

const App = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated, user } = useSelector((s) => s.auth);

  const hasMounted = useRef(false);

  // 🔑 1. Keep axios in sync with token
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (isAuthenticated && user?.name) {
      toast(`Welcome, ${user.name}`, {
        icon: <UserRoundCheck className="text-green-400" />,
      });
    }

    if (!isAuthenticated) {
      toast("You’ve been logged out", {
        icon: <LogOut className="text-zinc-400" />,
      });
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <ScrollToTop />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0b0f1a",
            color: "#f8fafc",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)",
            padding: "14px 16px",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
};

export default App;
