import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import orderRoutes from "./routes/orderRoute.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,

  message: {
    message: "Too many requests, try again later",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// routes
app.use("/orders", orderRoutes);

// connect MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// start server
const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`🚀 Order Service running on port ${PORT}`);
});
