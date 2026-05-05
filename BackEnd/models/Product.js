const mongoose = require('mongoose');

// A Schema defines the shape of the data stored in MongoDB.
// Think of it as a template — every product saved to the database
// must follow this structure.
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  description: { type: String, required: true },
  picture:     { type: String, default: 'placeholder.jpg' },
});

// mongoose.model() creates a "Model" — a class that gives us methods
// like Product.find(), Product.findById(), Product.findByIdAndUpdate(), etc.
// The first argument "Product" becomes the collection name in MongoDB
// (stored as "products" — lowercase + plural automatically).
module.exports = mongoose.model('Product', productSchema);
