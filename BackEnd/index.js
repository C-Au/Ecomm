require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Order = require("./models/Order");
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
    // fetch data
    let products = await Product.find();

    // format data / validate
    products = products.map((p) => {
      if (p.picture?.data) {
        p.picture.src = `data:${p.picture.filetype};base64,${p.picture.data}`;
      }
      return p;
    });

    res.json(products); // picture.data is already base64; use `data:${picture.filetype};base64,${picture.data}` on the frontend
  } catch (err) {
    res.status(500).send("Error fetching products: " + err.message);
  }
});

app.get("/product/search_id/:id", async (req, res) => {
  try {
    // fetch
    const product = await Product.findById(req.params.id);

    // validation but no formatting
    if (!product) {
      return res.status(404).send(`Product ${req.params.id} cannot be found!`);
    }

    if (product?.picture?.data && product?.picture?.filetype) {
     product.picture.src = `data:${product.picture.filetype};base64,${product.picture.data}`
    }
    
    // return data
    console.log(product)
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

    if (!name || !description || isNaN(parseFloat(price))) {
      return res.status(400).json({ error: "Invalid product fields" });
    }

    const newProduct = new Product({
      name,
      price: parseFloat(price),
      description,
      picture: picture
        ? {
            filename: picture.originalname,
            filetype: picture.mimetype,
            size: picture.size,
            data: picture.buffer.toString("base64"),
          }
        : null,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).send("Error adding product: " + err.message);
  }
});

app.put("/products/edit/:id", upload.single("picture"), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const pictureUpdate = req.file
      ? {
          filename: req.file.originalname,
          filetype: req.file.mimetype,
          size: req.file.size,
          data: req.file.buffer.toString("base64")
        }
      : null;

    const updateFields = { name, price: parseFloat(price), description };
    if (pictureUpdate) updateFields.picture = pictureUpdate;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
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

// ── Orders ───────────────────────────────────────────────────

app.post("/orders", async (req, res) => {
  try {
    const { name, email, items, total } = req.body;

    if (!name || !email || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const newOrder = new Order({ name, email, items, total });
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).send("Error placing order: " + err.message);
  }
});

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);
