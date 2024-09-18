import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  addProduct,
  deleteProduct,
  getProductsByCategory,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { protectRoute, isAdmin } from "../middlewares/auth.middleware.js";
import { multerUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", protectRoute, isAdmin, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/", multerUpload.single("image"), addProduct);
router.delete("/:id", protectRoute, deleteProduct);
router.get("/category/:category", getProductsByCategory);
router.put("/:id", protectRoute, isAdmin, toggleFeaturedProduct);
//router.get("/recommendations", getRecommendedProducts);  Implement this route

export default router;
