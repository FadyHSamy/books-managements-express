import express from "express";
import { getAllLanguages } from "../controllers/languageController";

const languageRouter = express.Router();

languageRouter.get("/language/getAllLanguage", async (req, res) => {
  try {
    await getAllLanguages(req, res);
  } catch (error) {
    console.error("Error during languageRoute:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default languageRouter;
