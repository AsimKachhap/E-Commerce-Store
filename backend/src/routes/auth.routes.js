import express from "express";
import {
  login,
  logout,
  refreshAccessToken,
  signUp,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh-access-token", refreshAccessToken);

export default router;
