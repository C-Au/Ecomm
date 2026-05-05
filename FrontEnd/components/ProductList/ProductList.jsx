// ============================================================
// ProductList.jsx — Fetches all products and renders them
//
// This component:
//   1. Asks the back-end for the full product list when it loads
//   2. Shows a loading message while waiting
//   3. Shows an error message if something goes wrong
//   4. Passes the products to <SlideDeck> to display them
// ============================================================

// We import the child components we will render inside this one.
import SingleProduct from "../SingleProduct/SingleProduct";
import SlideDeck from "../SlideDeck/SlideDeck";

// useEffect — run code at a specific moment (e.g. on page load)
// useState  — store data that can change and trigger a re-render
import { useEffect, useState } from "react";

// Link lets us navigate to another page without a full reload.
import {Link} from "react-router-dom";

// axios is a library for making HTTP requests to the back-end.
import axios from "axios";
import "./ProductList.css";

export default function ProductList() {

  // products — the array of product objects loaded from the DB.
  // Starts empty; filled in once the axios call succeeds.
  const [products, setProducts] = useState([]);

  // loading — true while we are waiting for the server response.
  // We use it to show a "Loading…" message so the user knows
  // something is happening.
  const [loading, setLoading] = useState(true);

  // error — stores an error message string if the request fails,
  // or null when everything is fine.
  const [error, setError] = useState(null);

  // useEffect with an empty array [] runs ONCE after the component
  // first appears on screen — perfect for fetching initial data.
  useEffect(() => {
    axios
      .get("http://localhost:8080/products")
      .then((response) => {
        console.log(response);

        // response?.data uses optional chaining (?.).
        // It means: "get response.data, but if response is null
        // or undefined, return undefined instead of crashing."
        const data = response?.data;
        console.log(data);

        // Array.isArray() checks that the server sent back an array.
        // If the server sent something unexpected (e.g. an error
        // message string), we catch it here and show a safe error.
        if (!Array.isArray(data)) {
          setError("Server returned unexpected data format.");
          setProducts([]);
          return;
        }

        // Save the products array into state so React re-renders
        // the component and shows the products on screen.
        setProducts(data);
      })
      .catch((err) => {
        // .catch() runs if the request itself failed (e.g. server
        // is offline, network error, etc.).
        console.error("Request failed:", err);
        setError("Failed to load products.");
      })
      .finally(() => {
        // .finally() ALWAYS runs after the request finishes,
        // whether it succeeded or failed.  We use it to turn off
        // the loading spinner in both cases.
        setLoading(false);
      });
  }, []); // <-- empty array = run once on mount

  // Early returns — if we are still loading or hit an error,
  // return a simple message instead of the full product grid.
  // React will not render anything else past an early return.
  if (loading) return <p className="product-list-loading">Loading products…</p>;
  if (error) return <p className="product-list-error">{error}</p>;

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Our Products</h1>

      {/* This older version rendered all products as a plain list.
          It is commented out and replaced by the SlideDeck below. */}
      {/*products.map((p) => {
        return <Link to={`product/${p._id}`}>
          <SingleProduct product={p} />
        </Link>;
      })*/}

      {/* products.map() loops over the products array and converts
          each product object "p" into a JSX element.

          For each product we create a <Link> that navigates to
          that product's detail page (e.g. /product/6641a2f3...).
          Inside the link we render the <SingleProduct /> card.

          The resulting array of JSX elements is passed to
          <SlideDeck items={...} /> which shows them one at a time. */}
      <SlideDeck items={
          products.map((p) => {
            return <Link to={`product/${p._id}`}> <SingleProduct product={p} /> </Link>;
          })
        }
      />

      <p className="product-list-footer">Showing all available products</p>
    </div>
  );
}


