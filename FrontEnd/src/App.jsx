import { Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home/Home";
import SingleProductPage from "../pages/SingleProductPage/SingleProductPage";
import ManageProducts from "../pages/ManageProducts/ManageProducts";
import Cart from "../pages/Cart/Cart";
import { CartProvider } from "./CartContext.jsx";
import { useCart } from "./useCart";
import "./App.css";
import { Toaster } from 'sonner';

function NavbarCartIcon() {
  const { cartCount } = useCart();
  return (
    <Link to="/cart" className="navbar-cart-link">
      <span className="navbar-cart-icon">🛒</span>
      {cartCount > 0 && (
        <span className="navbar-cart-badge">{cartCount}</span>
      )}
    </Link>
  );
}

function App() {
  return (
    <CartProvider>
      <div className="app-wrapper">
        <nav className="navbar">
          <span className="navbar-brand">
            SHOP<span>HAUS</span>
          </span>
          <div className="navbar-links">
            <Link to="/manage" className="navbar-link">
              Manage Products
            </Link>
            <NavbarCartIcon />
          </div>
        </nav>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<SingleProductPage />} />
            <Route path="/manage" element={<ManageProducts />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </div>
    </CartProvider>
  );
}

export default App;
