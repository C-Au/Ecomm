const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  picture: {
    filename: { type: String },
    filetype: { type: String },
    size:     { type: Number },
    data:     { type: String }, // base64-encoded image
  },
});

module.exports = mongoose.model("Product", productSchema);
