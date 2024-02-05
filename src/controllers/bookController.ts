import { Request, Response } from "express";
import { bookGenreResponse } from "../models/book";

const bookGenre = require("../models/book");

export const getAllBookGenre = async (req: Request, res: Response) => {
  try {
    const bookGenreResult = await bookGenre.find({});

    res.status(200).json({ data: bookGenreResult });
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
