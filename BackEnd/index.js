require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const cors = require("cors");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
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
});

app.post("/products/add", upload.single("picture"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const picture = req.file;

    console.log(picture);

    const newProduct = new Product({
      name,
      price: parseFloat(price),
      description,
      picture: picture
        ? {
            fileName: picture.originalname,
            fileType: picture.mimetype,
            fileSize: picture.size,
            fileData: picture.buffer,
          }
        : null,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).send("Error adding product: " + err.message);
  }
});

app.put("/products/edit/:id", async (req, res) => {
  try {
    const { name, price, description, picture } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price: parseFloat(price), description, picture },
      { new: true },
    );

    if (!updated) {
      return res.status(404).send(`Product ${req.params.id} not found`);
    }
    res.json(updated);
  } catch (err) {
    res.status(500).send("Error updating product: " + err.message);
  }
});

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

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);
