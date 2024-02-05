export interface bookGenreResponse {
  genre: string;
  description: string;
}
const mongoose = require("mongoose"); // Import the mongoose connection

const bookGenreSchema = new mongoose.Schema({
  genre: { type: String },
  description: { type: String },
}); 

const bookGenre = mongoose.model("genre", bookGenreSchema);

module.exports = bookGenre;
