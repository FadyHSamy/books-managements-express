// src/controllers/UserController.ts
import { Request, Response } from "express";
import { generateToken, verifyToken } from "../config/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";

const User = require("../models/user");
const bcrypt = require("bcrypt");

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, confirmPassword } = req.body;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // Example: Alphanumeric with underscore, 3 to 20 characters
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Example: Minimum eight characters, at least one letter and one number

    if (username === "") {
      return res.status(400).json({ error: "User Name is required" });
    } else if (!usernameRegex.test(username)) {
      return res.status(400).json({ error: "Alphanumeric with underscore, 3 to 20 characters" });
    }
    if (password === "") {
      return res.status(400).json({ error: "Password is required" });
    } else if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Minimum eight characters, at least one letter and one number" });
    }
    if (confirmPassword === "") {
      return res.status(400).json({ error: "Confirm Password is required" });
    } else if (confirmPassword !== password) {
      return res.status(400).json({ error: "Confirm password not match" });
    }

    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      return res.status(400).json({ error: "User Name is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let object = {
      username: username,
      password: password,
      hashedPassword: hashedPassword,
      salt: salt,
    };

    const newUser = new User({
      username: object.username,
      password: password,
      hashedPassword: object.hashedPassword,
      salt: object.salt,
    });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      let validationErrors: any = {};
      for (let field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({ error: "Validation failed", details: validationErrors });
    }

    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // Assuming user is an object with properties salt and hashedPassword
    const storedHashedPassword: string = user.hashedPassword;
    const passwordMatch: boolean = await bcrypt.compare(password, storedHashedPassword);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: { lastLoginDate: Date.now() } }, { new: true });

    const token = generateToken({
      username: updatedUser.username,
      userRole: updatedUser.userRole,
      status: updatedUser.status,
    });

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error: any) {
    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(400).json({ error: "Duplicate key error, username already exists" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyUserToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: "Token is missing" });
      return;
    }

    const decodedToken = await verifyToken(token);
    res.status(200).json({ message: "Token is verified", token: decodedToken });
  } catch (error) {
    console.error("Token verification error:", error);

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token has expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
