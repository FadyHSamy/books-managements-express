import { Request, Response } from "express";

const language = require("../models/language");

export const getAllLanguages = async (req: Request, res: Response) => {
  try {
    const languageResult = await language.find({});

    res.status(200).json({ data: languageResult });
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
