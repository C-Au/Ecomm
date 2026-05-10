import SingleProduct from "../SingleProduct/SingleProduct";
import SlideDeck from "../SlideDeck/SlideDeck";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ProductList.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/products")
      .then((response) => {
        const data = response?.data;
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

  if (loading) return <p className="product-list-loading">Loading products…</p>;
  if (error) return <p className="product-list-error">{error}</p>;

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Our Products</h1>
      <SlideDeck
        items={products.map((p) => (
          <Link to={`product/${p._id}`}>
            <SingleProduct product={p} />
          </Link>
        ))}
      />
      <p className="product-list-footer">Showing all available products</p>
    </div>
  );
}


