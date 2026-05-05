// ============================================================
// models/Product.js — The Product "blueprint"
//
// In MongoDB, data is stored as documents (similar to JSON objects).
// Before we can save a product, we need to tell MongoDB exactly what
// fields a product has and what type each field should be.
// That is what this file does.
//
// mongoose is the library that bridges Node.js and MongoDB.
// ============================================================
const mongoose = require('mongoose');

// ============================================================
// THE SCHEMA
//
// A Schema is the blueprint (or template) for a document.
// Think of it like designing a form: you decide in advance what
// fields the form has and whether each one is required.
//
// Each field gets an object that describes it:
//   type      — what kind of data it holds (String, Number, etc.)
//   required  — if true, MongoDB will refuse to save the document
//               if this field is missing
//   default   — a value that is used automatically when the field
//               is not provided at all
//
// MongoDB will also automatically add:
//   _id   — a unique ID for every document (we do not have to
//            create this ourselves)
//   __v   — a version key Mongoose uses internally (you can ignore it)
// ============================================================
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  description: { type: String, required: true },
  picture:     { type: String, default: 'placeholder.jpg' },
});

// ============================================================
// THE MODEL
//
// mongoose.model() takes the Schema and creates a "Model" \u2014 a
// JavaScript class that knows how to talk to MongoDB.
//
// The first argument is the model name ("Product").  Mongoose
// automatically creates a collection called "products" in the
// database (lowercase + plural of the model name).
//
// The Model gives us ready-made methods we use in index.js:
//   Product.find()                         \u2014 get all products
//   Product.findById(id)                   \u2014 get one product
//   new Product({...}).save()              \u2014 create a new product
//   Product.findByIdAndUpdate(id, data)    \u2014 edit a product
//   Product.findByIdAndDelete(id)          \u2014 delete a product
//
// module.exports makes this Model available to any other file
// that does require('./models/Product').
// ============================================================
module.exports = mongoose.model('Product', productSchema);
