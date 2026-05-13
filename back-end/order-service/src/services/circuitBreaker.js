import axios from "axios";
import CircuitBreaker from "opossum";

const USER_SERVICE =
  process.env.USER_SERVICE_URL || "http://localhost:8081/api";

const FOOD_SERVICE = process.env.FOOD_SERVICE_URL || "http://localhost:8082";

// ================= USER =================

async function getUser(userId) {
  const response = await axios.get(`${USER_SERVICE}/users/${userId}`, {
    timeout: 3000,
  });

  return response.data;
}

export const userBreaker = new CircuitBreaker(getUser, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
});

userBreaker.fallback(() => {
  return {
    error: "User Service unavailable",
  };
});

// ================= FOOD =================

async function getFood(foodId) {
  const response = await axios.get(`${FOOD_SERVICE}/foods/${foodId}`, {
    timeout: 3000,
  });

  return response.data;
}

export const foodBreaker = new CircuitBreaker(getFood, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
});

foodBreaker.fallback(() => {
  return {
    error: "Food Service unavailable",
  };
});

// ================= EVENTS =================

userBreaker.on("open", () => {
  console.log(" USER breaker OPEN");
});

foodBreaker.on("open", () => {
  console.log(" FOOD breaker OPEN");
});

userBreaker.on("halfOpen", () => {
  console.log(" USER breaker HALF_OPEN");
});

foodBreaker.on("halfOpen", () => {
  console.log(" FOOD breaker HALF_OPEN");
});

userBreaker.on("close", () => {
  console.log(" USER breaker CLOSED");
});

foodBreaker.on("close", () => {
  console.log(" FOOD breaker CLOSED");
});
