import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import Shop from "./screens/Shop";
import Cart from "./screens/Cart";
import ProductDetails from "./screens/ProductDetails";
import ScrollToTop from "./utils/scrollToTop";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<Shop />} />

        <Route path="/shop/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;
