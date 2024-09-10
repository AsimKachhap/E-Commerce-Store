import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./utils/db.js";

import authRoutes from "./routes/auth.routes.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

//middlewares
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Backend</h1>");
});

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, async () => {
  await connectDb();
  console.log(`Server is up and running on:  http://localhost:${PORT}`);
});
