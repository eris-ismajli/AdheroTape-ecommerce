import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import dealerRoute from "./routes/dealer.js";
import productsRoute from "./routes/products.js";
import wishlistRoute from "./routes/wishlist.js";
import cartRoute from "./routes/cart.js";
import reviewsRoute from "./routes/reviews.js";
import checkoutRoute from "./routes/checkout.js";
import profileRoute from "./routes/profile.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/dealer-application", dealerRoute);
app.use("/shop", productsRoute);
app.use("/user/wishlist", wishlistRoute);
app.use("/user/cart", cartRoute);
app.use("/reviews", reviewsRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/profile", profileRoute);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
