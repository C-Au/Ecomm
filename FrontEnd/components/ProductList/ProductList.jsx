import SingleProduct from "../SingleProduct/SingleProduct";
import { useEffect, useState } from "react";
import axios from "axios";

// const products = [
//   {
//     productId: "839201",
//     name: "Wireless Mouse",
//     price: 19.99,
//     description:
//       "A smooth and responsive wireless mouse for everyday computer use.",
//     picture: "wireless-mouse.jpg",
//   },
//   {
//     productId: "492183",
//     name: "Notebook",
//     price: 3.49,
//     description: "A lined notebook perfect for notes, sketches, or journaling.",
//     picture: "notebook.jpg",
//   },
//   {
//     productId: "175903",
//     name: "Coffee Mug",
//     price: 8.99,
//     description: "A ceramic mug ideal for coffee, tea, or hot chocolate.",
//     picture: "coffee-mug.jpg",
//   },
//   {
//     productId: "664210",
//     name: "Phone Stand",
//     price: 6.99,
//     description:
//       "A sturdy stand that holds your phone upright for easy viewing.",
//     picture: "phone-stand.jpg",
//   },
//   {
//     productId: "902771",
//     name: "Desk Lamp",
//     price: 24.99,
//     description:
//       "An adjustable desk lamp that provides bright and focused lighting.",
//     picture: "desk-lamp.jpg",
//   },
//   {
//     productId: "118452",
//     name: "Bluetooth Speaker",
//     price: 29.99,
//     description:
//       "A compact speaker with powerful sound and wireless connectivity.",
//     picture: "bluetooth-speaker.jpg",
//   },
//   {
//     productId: "547829",
//     name: "Water Bottle",
//     price: 12.49,
//     description:
//       "A durable reusable water bottle for staying hydrated all day.",
//     picture: "water-bottle.jpg",
//   },
//   {
//     productId: "736194",
//     name: "Laptop Sleeve",
//     price: 15.99,
//     description:
//       "A padded sleeve designed to protect your laptop during travel.",
//     picture: "laptop-sleeve.jpg",
//   },
//   {
//     productId: "309511",
//     name: "Backpack",
//     price: 39.99,
//     description: "A spacious backpack suitable for school, work, or travel.",
//     picture: "backpack.jpg",
//   },
//   {
//     productId: "882640",
//     name: "Wireless Charger",
//     price: 18.99,
//     description:
//       "A fast wireless charging pad compatible with most smartphones.",
//     picture: "wireless-charger.jpg",
//   },
//   {
//     productId: "461728",
//     name: "Keyboard",
//     price: 27.99,
//     description: "A full-size keyboard designed for comfortable typing.",
//     picture: "keyboard.jpg",
//   },
//   {
//     productId: "215903",
//     name: "Hair Brush",
//     price: 4.99,
//     description: "A lightweight brush that helps detangle and smooth hair.",
//     picture: "hair-brush.jpg",
//   },
// ];

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/products") // <-- FIXED ENDPOINT
      .then((response) => {
        const data = response?.data;
        console.log(data);
        if (!Array.isArray(data)) {
          setError("Server returned unexpected data format.");
          setProducts([]);
          return;
        }

        setProducts(data);
      })
      .catch((err) => {
        console.error("Request failed:", err);
        setError("Failed to load products.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Product List</h1>

      {products.map((p) => {
        return <SingleProduct product={p} />;
      })}

      <p>All products are in the list above</p>
    </div>
  );
}

// export default ProductList;

// return (
//   <div>
//     <h1>Expense data</h1>

//     {expList.map((expense, index) => {
//       const { date, description, category } = expense || {};

//       return (
//         <div
//           key={index}
//           style={{
//             border: "1px solid black",
//             padding: "8px",
//             marginBottom: "8px",
//           }}
//         >
//           <p>{date ?? "No date provided"}</p>
//           <p>{description ?? "No description provided"}</p>
//           <p>{category ?? "No category provided"}</p>
//         </div>
//       );
//     })}
//   </div>
// );
////////////////////////////////////////////////////////////

// 1) Don't know where to add console.log() in ProductList.jsx or should console.log() be in the backend in index.js?
// 2) How do I get an "response" from a call?
