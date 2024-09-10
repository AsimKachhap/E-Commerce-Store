import express from "express";
import { login, logout, signUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.get("/login", login);
router.get("/logout", logout);

export default router;
