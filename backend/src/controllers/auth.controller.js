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
    res.status(500).json({ message: "Something went wrong.", error: error });
    console.log(error);
  }
};

//LOGIN

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user.id, refreshToken);
      setCookies(res, accessToken, refreshToken);
      res.status(200).json({ message: "Logged in Successfully." });
    } else {
      res.status(400).json({ message: "Email or Password Incorrect." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
    console.log(error);
  }
};

//LOGOUT
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh-token"];
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    await redis.del(`refresh_token:${decoded.userId}`);
    res.clearCookie("access-token");
    res.clearCookie("refresh-token");
    res.status(200).json({ message: "Logged out Successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
