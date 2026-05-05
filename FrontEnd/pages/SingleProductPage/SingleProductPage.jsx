// ============================================================
// SingleProductPage.jsx — The detail page for one product
//
// This page is shown when the user clicks on a product card.
// The URL looks like: /product/6641a2f3c7b...
// React Router captures the id from the URL and this component
// uses it to fetch just that one product from the back-end.
// ============================================================

// useParams reads the dynamic parts of the URL.
// For the route "/product/:id", useParams() returns { id: "..." }
// where the value is whatever is in the actual URL.
import {useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SingleProduct from "../../components/SingleProduct/SingleProduct";

export default function SingleProductPage () {

    // Destructure the id out of the URL parameters.
    // If the URL is /product/abc123, then id === "abc123".
    const {id} = useParams();

    // product — starts as null; filled in once the axios call finishes.
    // null means "we have not loaded anything yet".
    const [product, setProduct] = useState(null);

    // loading / error follow the same pattern as ProductList.jsx:
    // show a spinner while waiting, show an error if it fails.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  // useEffect with [id] in the dependency array means:
  // "re-run this effect whenever the id value changes."
  // This handles the case where the user navigates directly from
  // one product page to another — the effect fires again and
  // fetches the new product's data.
  useEffect(() => {
    axios
      // Template literal (backtick string) lets us embed the id
      // variable directly into the URL string.
      .get(`http://localhost:8080/product/search_id/${id}`)
      .then((response) => {
        console.log(response);
        // Store the single product object in state.
        setProduct(response.data);
      })
      .catch((err) => {
        console.error("Request failed:", err);
        setError(`Failed to load product ${id}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]); // <-- re-run if the id in the URL changes

  // Placeholder for a future feature: load related products
  // by category once the main product has loaded.
//   useEffect(() => {
//     // load by cat axios call
//   }, [product])

  // Early returns show feedback while the data is not ready yet.
  if (loading) return <p>Loading product {id}…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Product Page</h1>

        {/* Pass the loaded product object down to <SingleProduct />
            as a prop.  SingleProduct will read product.name,
            product.price, etc. and render the card. */}
        <SingleProduct product={product} />;

        <div>
            {/* Placeholder: in a future update, map over a list of
                related products and render a card for each one. */}
            {/*do the map over the list of cat related products*/}
        </div>
    </div>
  );
}