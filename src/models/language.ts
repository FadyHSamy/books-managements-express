export interface getAllLanguageResponse {
  language: string;
}
const mongoose = require("mongoose"); // Import the mongoose connection

const getAllLanguageSchema = new mongoose.Schema({
  language: { type: String },
});

const language = mongoose.model("languages", getAllLanguageSchema);

module.exports = language;
