// ============================================================
// Home.jsx — The landing page of the shop
//
// This component is shown when the user visits the root URL "/".
// It renders a hero banner (welcome message) and then drops in
// the <ProductList /> component which handles fetching and
// displaying all products.
//
// Keeping the page simple like this is a good React pattern:
// each component has one job, and pages just arrange them.
// ============================================================

// We import the ProductList component so we can use it as a
// custom HTML-like tag: <ProductList />
import ProductList from "../../components/ProductList/ProductList";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">

      {/* The hero section is the big welcome banner at the top.
          <span className="accent"> applies a highlight colour
          to just the word "ShopHaus" via CSS. */}
      <div className="home-hero">
        <h2>Welcome to <span className="accent">ShopHaus</span></h2>
        <p>Browse our latest products and find something you love.</p>
      </div>

      {/* <ProductList /> is our custom component defined in
          components/ProductList/ProductList.jsx.
          React will render whatever that component returns here. */}
      <ProductList />
    </div>
  );
}

export default Home;
