import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import {
  generateRefreshToken,
  generateAccessToken,
} from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import verifyUser from "../middlewares/verifyUser.js";

const router = express.Router();

// Register route (already existing)
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username)
    return res.status(400).json({ error: "Bad Request - Missing Username." });
  if (!email)
    return res.status(400).json({ error: "Bad Request - Missing Email." });
  if (!password)
    return res.status(400).json({ error: "Bad Request - Missing Password." });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bad Request - Username or Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("User registered successfully");
    return res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username)
    return res.status(400).json({ error: "Bad Request - Missing Username" });
  if (!password)
    return res.status(400).json({ error: "Bad Request - Missing Password" });
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Bad Request - User not found" });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ error: "Bad Request - Invalid Password" });
    }
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .status(200)
      .json({ message: "User Login successful", accessToken });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", verifyUser, async (req, res) => {
  try {
    // Set refreshToken to null in the database.
    await User.findByIdAndUpdate(req.user._id, {
      $set: { refreshToken: null },
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in logout route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/refreshToken", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({ error: "User not logged in" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(400).json({ error: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error in refresh token route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/quiz", verifyUser, (req, res) => {
  try {
    res.status(200).json({
      message: "Welcome to the Home page!",
      user: req.user,
    });
  } catch (error) {
    console.error("Error while accessing /home route:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
