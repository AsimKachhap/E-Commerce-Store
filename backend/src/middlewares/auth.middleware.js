import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies["access-token"];
    try {
      const user = await jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET
      );
      if (!user) {
        return res.status(401).json({ message: " User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token Expired" });
      }
      throw error;
    }
  } catch (error) {
    return res.status(403).json({
      message: " Unauthorized Access: Invalid Token",
      error: error.message,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  const user = await User.find({ _id: req.user.userId });
  if (!user.role === "admin") {
    return res.status(403).json({
      message: "Unauthorized Access : Only Admins are allowed on this route.",
    });
  }
  next();
};
