import express from "express";
import { getAllBookGenre } from "../controllers/bookController";

const bookRouter = express.Router();

bookRouter.get("/book/getAllBookGenre", async (req, res) => {
  try {
    await getAllBookGenre(req, res);
  } catch (error) {
    console.error("Error during getAllBookGenre:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default bookRouter;
