import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import Shop from "./screens/Shop";
import ScrollToTop from "./utils/scrollToTop";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </Router>
  );
};

export default App;
