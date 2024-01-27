import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/authRoutes";
import { connectToDatabase } from "./config/mongo";
import { loginUser, registerUser } from "./controllers/AuthController";
import userRouter from "./routes/authRoutes";

const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3100;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
connectToDatabase();

// Routes
app.use("", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
