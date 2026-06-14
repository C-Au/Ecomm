import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SingleProduct from "../../components/SingleProduct/SingleProduct";
import "./SingleProductPage.css";

export default function SingleProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/product/search_id/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((err) => {
        console.error("Request failed:", err);
        setError(`Failed to load product ${id}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="spp-loading">Loading product {id}…</p>;
  if (error) return <p className="spp-error">{error}</p>;

  return (
    <div className="spp-container">
      <h1 className="spp-page-title">Product Page</h1>

      <button className="spp-back-btn" onClick={() => navigate("/")}>← Back to Home</button>

      <div className="spp-card-wrapper">
        <SingleProduct product={product} />
      </div>
    </div>
  );
}
