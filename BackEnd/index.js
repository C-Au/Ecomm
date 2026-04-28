const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const cors = require("cors");

const productList = [
    {
      productId: "839201",
      name: "Wireless Mouse",
      price: 19.99,
      description:
        "A smooth and responsive wireless mouse for everyday computer use.",
      picture: "wireless-mouse.jpg",
    },
    {
      productId: "492183",
      name: "Notebook",
      price: 3.49,
      description:
        "A lined notebook perfect for notes, sketches, or journaling.",
      picture: "notebook.jpg",
    },
    {
      productId: "175903",
      name: "Coffee Mug",
      price: 8.99,
      description: "A ceramic mug ideal for coffee, tea, or hot chocolate.",
      picture: "coffee-mug.jpg",
    },
    {
      productId: "664210",
      name: "Phone Stand",
      price: 6.99,
      description:
        "A sturdy stand that holds your phone upright for easy viewing.",
      picture: "phone-stand.jpg",
    },
    {
      productId: "902771",
      name: "Desk Lamp",
      price: 24.99,
      description:
        "An adjustable desk lamp that provides bright and focused lighting.",
      picture: "desk-lamp.jpg",
    },
    {
      productId: "118452",
      name: "Bluetooth Speaker",
      price: 29.99,
      description:
        "A compact speaker with powerful sound and wireless connectivity.",
      picture: "bluetooth-speaker.jpg",
    },
    {
      productId: "547829",
      name: "Water Bottle",
      price: 12.49,
      description:
        "A durable reusable water bottle for staying hydrated all day.",
      picture: "water-bottle.jpg",
    },
    {
      productId: "736194",
      name: "Laptop Sleeve",
      price: 15.99,
      description:
        "A padded sleeve designed to protect your laptop during travel.",
      picture: "laptop-sleeve.jpg",
    },
    {
      productId: "309511",
      name: "Backpack",
      price: 39.99,
      description: "A spacious backpack suitable for school, work, or travel.",
      picture: "backpack.jpg",
    },
    {
      productId: "882640",
      name: "Wireless Charger",
      price: 18.99,
      description:
        "A fast wireless charging pad compatible with most smartphones.",
      picture: "wireless-charger.jpg",
    },
    {
      productId: "461728",
      name: "Keyboard",
      price: 27.99,
      description: "A full-size keyboard designed for comfortable typing.",
      picture: "keyboard.jpg",
    },
    {
      productId: "215903",
      name: "Hair Brush",
      price: 4.99,
      description: "A lightweight brush that helps detangle and smooth hair.",
      picture: "hair-brush.jpg",
    },
  ];

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

app.get("/products", (req, res) => {
  res.json(productList); // {data : productsList}
});

app.get("/product/search_id/:id", (req, res) => {
  const productId = req.params.id;

  // try to find the prouct
  const currProduct = productList.find((p) => {
    return p.productId == productId;
  })

  // if found return it
  if (currProduct) {
    res.json(currProduct);
  } else {
    res.status(404).send(`Product ${productId} cannot be found!`);
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
app.post("/products/add", (req, res) => {

  // req.body contains the object the front-end sent us.
  // We destructure it — meaning we pull out each field by name
  // from that object into its own variable.
  const { name, price, description, picture } = req.body;

  // Build a brand new product object.
  // We generate a random 6-digit ID so every product is unique.
  // Math.random() gives a decimal 0-1, multiply by 900000 gives
  // a number up to 900000, add 100000 so it is never less than
  // 100000, Math.floor() removes the decimals, .toString() turns
  // the number into text so it matches how the other IDs look.
  const newProduct = {
    productId: Math.floor(Math.random() * 900000 + 100000).toString(),
    name: name,
    price: parseFloat(price),   // parseFloat converts "9.99" (text) to 9.99 (number)
    description: description,
    picture: picture || "placeholder.jpg",  // if no picture was provided, use a fallback
  };

  // Push the new product onto the end of our productList array —
  // the same array that the GET /products route reads from.
  productList.push(newProduct);

  // Send the new product back to the front-end so it can show it
  // immediately without reloading the page.
  // Status 201 means "Created" — a more specific version of 200 OK.
  res.status(201).json(newProduct);
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
app.put("/products/edit/:id", (req, res) => {

  // Grab the product ID out of the URL
  const productId = req.params.id;

  // Grab the updated fields out of the request body
  const { name, price, description, picture } = req.body;

  // findIndex works like find() but returns the POSITION (index)
  // of the matching item in the array instead of the item itself.
  // We need the position so we can overwrite it on the next line.
  // If nothing is found, findIndex returns -1.
  const index = productList.findIndex((p) => p.productId == productId);

  // If the product does not exist, tell the front-end with a 404
  if (index === -1) {
    return res.status(404).send(`Product ${productId} not found`);
  }

  // Overwrite the old product at that position with the updated data.
  // We keep the same productId so the product does not change its identity.
  productList[index] = {
    productId: productId,
    name: name,
    price: parseFloat(price),
    description: description,
    picture: picture,
  };

  // Send the updated product back to the front-end
  res.json(productList[index]);
});


// ============================================================
// STEP 1D — DELETE route: REMOVE a product.
//
// "DELETE" is the HTTP verb for removing data.
// Example URL: DELETE http://localhost:8080/products/delete/839201
// ============================================================
app.delete("/products/delete/:id", (req, res) => {

  // Grab the ID from the URL
  const productId = req.params.id;

  // Find the position of the product in the array
  const index = productList.findIndex((p) => p.productId == productId);

  // If it does not exist, return a 404
  if (index === -1) {
    return res.status(404).send(`Product ${productId} not found`);
  }

  // splice(index, 1) removes exactly 1 item at that position.
  // It also returns the removed item(s) as an array, so [0] gets
  // just the one product we deleted.
  const deleted = productList.splice(index, 1)[0];

  // Send the deleted product back so the front-end knows what was removed
  res.json(deleted);
});

// GET /product/search_cat/:cat

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);

// 1) Type in "node index.js" to run backend
// 2) Visit http://localhost:8080/products in your browser
// 3) Check your terminal — you'll see the products array printed there
  