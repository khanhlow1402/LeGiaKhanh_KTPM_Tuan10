const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be >= 0"]
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true // tự tạo createdAt + updatedAt
  }
);

module.exports = mongoose.model("Food", foodSchema);