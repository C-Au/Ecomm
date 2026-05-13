// ============================================================
// SETUP — Load packages and configure the server
//
// require('dotenv').config() reads the .env file in this folder
// and loads its values into process.env so we can access them
// safely (e.g. process.env.MONGO_URI).  This MUST be the very
// first line so that every other file that runs after it can
// also read those environment variables.
//
// require('mongoose') loads Mongoose — a library that lets Node.js
// talk to MongoDB in a structured, organized way.
//
// require('./models/Product') loads the Product blueprint we
// defined in models/Product.js.  We use it to read and write
// products in the database.
//
// require('express') loads the Express library — the tool we use
// to create a web server and define URL routes.
//
// express() creates the actual server application.
//
// HTTP_PORT is the port number the server listens on.
// process.env.PORT checks if a hosting service (like Railway or
// Render) has set a port for us; if not, we fall back to 8080.
//
// cors allows the React front-end (running on a different port
// like 5173) to make requests to this server.  Without it the
// browser would block those requests for security reasons.
// ============================================================
require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('./models/Product')
const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const cors = require("cors");

// ============================================================
// CONNECT TO MONGODB
//
// mongoose.connect() opens a connection to the MongoDB database.
// We pass it the connection string from .env — this string
// contains the username, password, and address of the database.
//
// Because connecting takes a moment (it goes over the internet),
// mongoose.connect() returns a Promise.  A Promise is JavaScript's
// way of saying "I'll let you know when this is done."
//
// .then(...)  runs if the connection SUCCEEDS — we log a message.
// .catch(...) runs if the connection FAILS   — we log the error.
//
// Once connected, Mongoose automatically keeps the connection open
// so every route below can query the database.
// ============================================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// app.use(cors()) turns on CORS for every request that comes
// into the server.  Think of CORS as a bouncer — by default it
// blocks requests from different origins (different ports or
// domains).  Calling app.use(cors()) tells the bouncer to let
// everyone in.  In production you would restrict this to specific
// allowed origins.
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

// express.static("public") automatically serves any file inside
// the /public folder as a downloadable file.  For example if you
// put an image at public/photo.jpg, a browser can fetch it at
// http://localhost:8080/photo.jpg with no extra route needed.
app.use(express.static("public"));

// A simple test route — visiting http://localhost:8080/ in the
// browser should show the word "Data".  Useful for checking that
// the server started correctly.
app.get("/", (req, res) => {
  res.send("Data");
});

// ============================================================
// GET /products — Return ALL products from the database
//
// "async" before (req, res) means this function uses await inside.
// Any route that talks to a database should be async because
// database calls take time and we need to wait for the result
// before sending a response.
//
// try / catch is used for error handling:
//   try   — run the database code
//   catch — if anything goes wrong, catch the error and tell the
//           front-end something went wrong (status 500 = server error)
//
// Product.find() is a Mongoose method that returns ALL documents
// in the "products" collection — the same as "SELECT * FROM products"
// in SQL.  We await it because the result comes back asynchronously.
//
// res.json(products) converts the array of products to JSON and
// sends it back to whoever made the request (e.g. React's axios).
// ============================================================
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send("Error fetching products: " + err.message);
  }
});

// ============================================================
// GET /product/search_id/:id — Return ONE product by its ID
//
// :id is a URL parameter — a placeholder that the front-end fills
// in when it makes the request.  For example the React page for a
// product might call:
//   axios.get("http://localhost:8080/product/search_id/6641a2f3...")
// and Express makes that ID available as req.params.id.
//
// Product.findById(id) searches MongoDB for a document whose _id
// field matches.  If nothing is found it returns null.
//
// We check "if (!product)" — the ! means "if NOT" — so this block
// runs when the product is null (not found).  We return a 404
// status which means "Not Found".
// ============================================================
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
app.post("/products/add", upload.single("picture"), async (req, res) => {
  try {
    // req.body is the JSON object the front-end sent.
    // Destructuring pulls each named field out into its own variable.
    // This is shorthand for: const name = req.body.name; etc.
    const { name, price, description } = req.body;
    const picture = req.file;

    // "new Product({...})" creates a new document in memory using
    // the schema we defined in models/Product.js.  It has not been
    // saved to the database yet — think of it as filling out a form.
    //
    // parseFloat(price) converts the price from a string ("9.99")
    // to an actual number (9.99) because HTML form inputs always
    // send text, not numbers.
    //
    // picture || "placeholder.jpg" means: use the picture value if
    // one was provided; otherwise use "placeholder.jpg" as a fallback.
    // The || is the "OR" operator — it returns the first truthy value.

    // originalname - name
    // mimetype
    // size
    // buffer

    console.log(picture);

    const newProduct = new Product({
      name,
      price: parseFloat(price),
      description,
      picture: picture ? {
        fileName: picture.originalname,
        fileType: picture.mimetype,
        fileSize: picture.size,
        fileData: picture.buffer
      } : null,
    });

    // .save() writes the document to the database and returns
    // the saved version (including the generated _id).
    // We await it because writing to the database takes time.
    const saved = await newProduct.save();

    // Status 201 means "Created" — more specific than 200 OK.
    // We send the saved product back so the front-end immediately
    // has access to its new _id without re-fetching everything.
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
    // Pull the updated field values out of the request body.
    const { name, price, description, picture } = req.body;

    // findByIdAndUpdate() is a Mongoose shortcut that does three
    // things in one step:
    //   1. Find the document whose _id matches req.params.id
    //   2. Apply the new values to its fields
    //   3. Return the result
    //
    // The third argument { new: true } is an options object.
    // By default Mongoose returns the OLD document (before the update).
    // Setting new: true tells it to return the NEW (updated) document
    // instead, which is almost always what we want.
    //
    // If the _id is not found in the database, updated will be null.
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
    // findByIdAndDelete() finds the document by _id, permanently
    // removes it from the database, and returns the deleted document.
    // If the product is not found it returns null.
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).send(`Product ${req.params.id} not found`);
    }

    // We send the deleted product back to the front-end.
    // The front-end can then use it to remove that exact item from
    // its local state without needing to re-fetch the whole list.
    res.json(deleted);
  } catch (err) {
    res.status(500).send("Error deleting product: " + err.message);
  }
});

// GET /product/search_cat/:cat

// ============================================================
// START THE SERVER
//
// app.listen(port, callback) tells Express to start listening
// for incoming requests on the given port number.
// Once it is ready, it calls onHttpStart() which prints a
// confirmation message to the terminal so we know it worked.
// ============================================================
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);

// 1) Type in "node index.js" to run backend
// 2) Visit http://localhost:8080/products in your browser
// 3) Check your terminal — you'll see the products array printed there
  