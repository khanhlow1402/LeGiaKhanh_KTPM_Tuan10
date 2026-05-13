import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/paymentRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", router);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "payment-service",
    port: process.env.PORT || 8083,
  });
});

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`\n Payment + Notification Service running on port ${PORT}`);
  console.log(`   POST http://localhost:${PORT}/payments`);
  console.log(`   GET  http://localhost:${PORT}/payments`);
  console.log(`   GET  http://localhost:${PORT}/notifications\n`);
});
