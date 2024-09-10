import User from "../models/user.model.js";

//SIGNUP
export const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ username });

    if (userExists) res.status(401).json({ message: "User Already Exists" });
    const user = await User.create({ username, email, password });
    res
      .status(400)
      .json({ data: user, message: "New User Created Successfully" });
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
