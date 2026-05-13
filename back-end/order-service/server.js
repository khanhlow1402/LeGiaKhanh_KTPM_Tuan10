import "dotenv/config"; // Thay cho require("dotenv").config()
import express from "express";
import connectDB from "./config/db.js"; // Nhớ thêm đuôi .js
import orderRoutes from "./routes/orderRoute.js"; // Nhớ thêm đuôi .js

const app = express();

app.use(express.json());

connectDB();

app.use("/payment", orderRoutes);

const PORT = process.env.PORT || 8083; // Nên có dự phòng port
app.listen(PORT, () => {
  console.log(`🚀 Order Service running at http://localhost:${PORT}`);
});
