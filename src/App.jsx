import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import Shop from "./screens/Shop";
import Cart from "./screens/Cart";
import ProductDetails from "./screens/ProductDetails";
import ScrollToTop from "./utils/scrollToTop";
import Wishlist from "./screens/Wishlist";
import Login from "./screens/Login";
import Register from "./screens/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCart, syncCartOnLogin } from "./store/cart/actions";
import { fetchWishlist } from "./store/wishlist/actions";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
