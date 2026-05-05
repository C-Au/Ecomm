require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('./models/Product')
const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const cors = require("cors");

// Connect to MongoDB using the connection string stored in .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());

// ============================================================
// STEP 1A — Tell Express to read JSON data that the browser sends us.
// Without this line, when the front-end sends us a new product's
// details, the server would receive nothing.  express.json() is a
// "middleware" — think of it as a translator that reads the
// incoming message and converts it into a plain JavaScript object
// so we can use it with req.body below.
// ============================================================
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Data");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send("Error fetching products: " + err.message);
  }
});

app.get("/product/search_id/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send(`Product ${req.params.id} cannot be found!`);
    }
    res.json(product);
  } catch (err) {
    res.status(500).send("Error fetching product: " + err.message);
  }
})

// ============================================================
// STEP 1B — POST route: ADD a brand new product.
//
// "POST" is the HTTP verb the browser uses to say "I am sending
// you new data to save."  The URL we choose is /products/add.
// The front-end will call axios.post("http://localhost:8080/products/add", formData)
// and that form data will land here inside req.body.
// ============================================================
app.post("/products/add", async (req, res) => {
  try {
    const { name, price, description, picture } = req.body;

    // Create a new Product document using our Mongoose model.
    // MongoDB will automatically generate a unique _id for it.
    const newProduct = new Product({
      name,
      price: parseFloat(price),
      description,
      picture: picture || "placeholder.jpg",
    });

    // .save() writes the document to the database and returns
    // the saved version (including the generated _id).
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).send("Error adding product: " + err.message);
  }
});


// ============================================================
// STEP 1C — PUT route: EDIT an existing product.
//
// "PUT" is the HTTP verb the browser uses to say "I want to
// replace/update data that already exists."
// The :id in the URL is a wildcard — whatever the front-end puts
// there is accessible as req.params.id.
// Example URL: PUT http://localhost:8080/products/edit/839201
// ============================================================
app.put("/products/edit/:id", async (req, res) => {
  try {
    const { name, price, description, picture } = req.body;

    // findByIdAndUpdate() finds the product by its MongoDB _id,
    // applies the new data, and returns the updated document.
    // { new: true } means "return the updated version, not the old one".
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price: parseFloat(price), description, picture },
      { new: true }
    );

    if (!updated) {
      return res.status(404).send(`Product ${req.params.id} not found`);
    }
    res.json(updated);
  } catch (err) {
    res.status(500).send("Error updating product: " + err.message);
  }
});


// ============================================================
// STEP 1D — DELETE route: REMOVE a product.
//
// "DELETE" is the HTTP verb for removing data.
// Example URL: DELETE http://localhost:8080/products/delete/839201
// ============================================================
app.delete("/products/delete/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).send(`Product ${req.params.id} not found`);
    }
    res.json(deleted);
  } catch (err) {
    res.status(500).send("Error deleting product: " + err.message);
  }
});

// GET /product/search_cat/:cat

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);

// 1) Type in "node index.js" to run backend
// 2) Visit http://localhost:8080/products in your browser
// 3) Check your terminal — you'll see the products array printed there
  