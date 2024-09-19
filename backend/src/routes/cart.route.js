import express from "express";
import { addToCart, updateQuantity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, addToCart);
// router.post("/", protectRoute, removeAllFromCart);
router.put("/:id", protectRoute, updateQuantity);
// router.get("/", protectRoute, getAllProduct);

export default router;
