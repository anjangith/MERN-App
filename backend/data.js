const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
  {
    id: Number,
    quote: String,
    author: String,
    likes: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);
