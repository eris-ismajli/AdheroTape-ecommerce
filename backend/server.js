import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dealerRoute from "./routes/dealer.js";
import productsRoute from "./routes/products.js"; // 👈 add this

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/dealer-application", dealerRoute);
app.use("/shop", productsRoute);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
