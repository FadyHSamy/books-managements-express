import express from "express";
import { registerUser, loginUser, verifyUserToken } from "../controllers/AuthController";

const userRouter = express.Router();

// Register a new user
userRouter.post("/auth/register", async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Login user
userRouter.post("/auth/login", async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.post("/auth/verify-token", async (req, res) => {
  try {
    await verifyUserToken(req, res);
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default userRouter;
