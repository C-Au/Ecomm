// ============================================================
// App.jsx
//
// This file is the "router" of the application.
// It decides which page component to show based on the
// current URL in the browser's address bar.
//
// We added two things here:
//   1. A new <Link> in the navbar so users can click to the
//      Manage Products page.
//   2. A new <Route> so React Router knows what to render
//      when the URL is /manage.
// ============================================================

import { Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home/Home";
import SingleProductPage from "../pages/SingleProductPage/SingleProductPage";

// STEP 3A — Import the new ManageProducts page we just created.
// The path "../pages/ManageProducts/ManageProducts" means:
//   go up one folder from src/  →  into pages/  →  into ManageProducts/  →  the file
import ManageProducts from "../pages/ManageProducts/ManageProducts";

import "./App.css";

function App() {
  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <span className="navbar-brand">
          SHOP<span>HAUS</span>
        </span>

        {/* STEP 3B — Add a navigation link to the Manage page.
            <Link to="/manage"> is the React Router equivalent of
            <a href="/manage">.  Using Link (instead of a plain <a>)
            prevents the page from fully reloading — React swaps in
            the new page instantly without a network round-trip.     */}
        <Link to="/manage" style={{ marginLeft: "1rem", color: "white" }}>
          Manage Products
        </Link>
      </nav>

      <div className="page-content">
        <Routes>
          {/* The existing routes — do not touch these */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<SingleProductPage />} />

          {/* STEP 3C — Register the new route.
              When the browser URL is exactly /manage, React Router
              will render the <ManageProducts /> component here.     */}
          <Route path="/manage" element={<ManageProducts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
