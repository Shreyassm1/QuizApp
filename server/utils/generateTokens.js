import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Generate Access Token
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      userName: user.userName,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// Generate Refresh Token
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    }
  );
};
