require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const connectDB = require("./config/db");
const foodRoutes = require("./routes/food.routes");


const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());

// connect database
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("Food Service is running...");
});
app.use("/foods", foodRoutes);

const PORT = process.env.PORT || 8082;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});