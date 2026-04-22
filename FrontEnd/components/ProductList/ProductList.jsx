import SingleProduct from "../SingleProduct/SingleProduct";
import SlideDeck from "../SlideDeck/SlideDeck";
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import axios from "axios";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/products") // <-- FIXED ENDPOINT
      .then((response) => {
        console.log(response);
        const data = response?.data;
        console.log(data); // Format of the variable data is printed out in the terminal
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

      {/*products.map((p) => {
        return <Link to={`product/${p.productId}`}>
          <SingleProduct product={p} />
        </Link>;
      })*/}
      
      <SlideDeck items={
          products.map((p) => {
            return <Link to={`product/${p.productId}`}> <SingleProduct product={p} /> </Link>;
          })
        } 
      />

      <p>All products are in the list above</p>
    </div>
  );
}


