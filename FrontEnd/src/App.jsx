import { Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home/Home";
import SingleProductPage from "../pages/SingleProductPage/SingleProductPage";
import ManageProducts from "../pages/ManageProducts/ManageProducts";
import "./App.css";

function App() {
  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <span className="navbar-brand">
          SHOP<span>HAUS</span>
        </span>
        <Link to="/manage" style={{ marginLeft: "1rem", color: "white" }}>
          Manage Products
        </Link>
      </nav>

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<SingleProductPage />} />
          <Route path="/manage" element={<ManageProducts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
