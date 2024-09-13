import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies["access-token"];
    try {
      const user = await jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET
      );
      if (!user) {
        res.status(401).json({ message: " User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        res.status(403).json({ message: "Token Expired" });
      }
      throw error;
    }
  } catch (error) {
    res.status(403).json({
      message: " Unauthorized Access: Invalid Token",
      error: error.message,
    });
  }
};

export const isAdmin = () => {
  if (!user.isAdmin) {
    res.status(403).json({
      messagge: "Unauthorized Acces : Only Adims are alloowed on this route.",
    });
  }
  next();
};
