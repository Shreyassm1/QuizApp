import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyUser = async (req, res, next) => {
  try {
    if (!req.cookies || !req.cookies.accessToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized access. No token found." });
    }

    const token = req.cookies.accessToken;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken || !decodedToken._id) {
      return res.status(401).json({ error: "Invalid access token." });
    }

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res
        .status(401)
        .json({ error: "Owner not found. Unauthorized access." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);

    let errorMessage = "Invalid access token.";

    if (error.name === "TokenExpiredError") {
      errorMessage = "Access token expired. Please login again.";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Invalid access token.";
    }

    return res.status(401).json({ error: errorMessage });
  }
};

export default verifyUser;
