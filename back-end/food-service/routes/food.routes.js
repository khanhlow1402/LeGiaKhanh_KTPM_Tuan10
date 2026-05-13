const express = require("express");
const router = express.Router();

const foodController = require("../controllers/food.controller");

// 🔹 GET /foods
router.get("/", foodController.getFoods);

// 🔹 POST /foods
router.post("/", foodController.createFood);

// 🔹 PUT /foods/:id
router.put("/:id", foodController.updateFood);

// 🔹 DELETE /foods/:id
router.delete("/:id", foodController.deleteFood);

router.get("/:id", foodController.getFoodById);

module.exports = router;
