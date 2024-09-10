import User from "../models/user.model.js";
import { redis } from "../utils/redis.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("access-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    samesite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh-token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    samesite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

//SIGNUP
export const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ username });

    if (userExists) res.status(401).json({ message: "User Already Exists" });
    const user = await User.create({ username, email, password });

    //Generating Tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    //Storing Refresh token
    await storeRefreshToken(user._id, refreshToken);

    //Setting Cookies
    setCookies(res, accessToken, refreshToken);
    res.status(400).json({
      data: user,
      message: "New User Created Successfully",
    });
    console.log("User Saved SUCCESFULLY");
  } catch (error) {
    res.status(400).json({ message: "Something went wrong.", error: error });
    console.log(error);
  }
};

//LOGIN

export const login = async (req, res) => {
  res.send("Login route got a hit");
};

export const logout = async (req, res) => {
  res.send("Logout route got a hit");
};
