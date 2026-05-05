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

// ============================================================
// App.jsx — The root component and router of the application
//
// Every React app has one "root" component that sits at the top
// of the component tree.  App.jsx is that component here.
// Its job is to:
//   1. Render the persistent navbar that appears on every page
//   2. Use React Router to show the correct page based on the URL
// ============================================================

// Routes, Route, and Link all come from react-router-dom.
//   Routes  — a container that looks at the current URL and
//             renders the first <Route> whose path matches.
//   Route   — pairs a URL path with a component to show.
//   Link    — a navigation element that changes the URL without
//             refreshing the whole page (faster than <a href>).
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
    // className="app-wrapper" links to a CSS class in App.css.
    // In React we use className instead of class because "class"
    // is a reserved word in JavaScript.
    <div className="app-wrapper">

      {/* The <nav> is the top bar that is always visible.
          It contains the brand name and the navigation links. */}
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
        {/* <Routes> looks at the current URL and renders the first
            <Route> whose path matches it.

            path="/"            → show the Home page
            path="/product/:id" → show a single product; :id is a
                                  wildcard that becomes available
                                  inside SingleProductPage via useParams()
            path="/manage"      → show the admin Manage Products page */}
        <Routes>
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

// export default makes App available to main.jsx which imports it.
export default App;
