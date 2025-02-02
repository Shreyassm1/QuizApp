import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url"; // Import pathToFileURL to convert paths to file URLs

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Vite dev server URL
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(
  session({ secret: "fstiwrhsb", resave: false, saveUninitialized: false })
);

// Dynamically load routes from the routes folder
const __filename = fileURLToPath(import.meta.url); // Get the current file's URL
const __dirname = path.dirname(__filename); // Get the directory name of the current file

fs.readdirSync(path.join(__dirname, "routes")).forEach((file) => {
  const filePath = path.join(__dirname, "routes", file);
  const fileURL = pathToFileURL(filePath).href; // Convert the file path to file URL

  import(fileURL) // Use the file URL in dynamic import
    .then((route) => {
      app.use(route.default); // Make sure each route file exports as default
    })
    .catch((err) => {
      console.log(`Failed to load ${file}:`, err);
    });
});

// Serve static files from the 'dist' directory (for production build of Vite)
app.use(express.static(path.join(__dirname, "client", "dist")));

// Catch-all route to serve index.html for any frontend route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error =>", err));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
