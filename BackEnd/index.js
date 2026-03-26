const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Data");
});

app.get("/products", (req, res) => {
  const products = [
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

  res.json({ data: products });
  console.log(products);
});

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);
