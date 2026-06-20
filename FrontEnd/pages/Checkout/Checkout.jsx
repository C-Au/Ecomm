import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useCart } from "../../src/useCart";
import "./Checkout.css";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    const orderPayload = {
      name: form.name,
      email: form.email,
      items: cart.map(({ product, quantity }) => ({
        product: product._id,
        quantity,
      })),
      total: cartTotal,
    };

    axios
      .post("http://localhost:8080/orders", orderPayload)
      .then(() => {
        clearCart();
        toast.success("Order placed! Thank you, " + form.name + ".");
        navigate("/");
      })
      .catch((err) => {
        console.error("Could not place order:", err);
        toast.error("Could not place order. Please try again.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <h1 className="checkout-page-title">Checkout</h1>
        <Link to="/cart">
          <button className="checkout-back-btn">← Back to Cart</button>
        </Link>
        <div className="checkout-card">
          <p className="checkout-empty">Your cart is empty. Add some products before checking out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-page-title">Checkout</h1>

      <Link to="/cart">
        <button className="checkout-back-btn">← Back to Cart</button>
      </Link>

      <div className="checkout-layout">
        {/* ── Order Summary ── */}
        <div className="checkout-card checkout-summary">
          <h2 className="checkout-section-title">Order Summary</h2>
          <div className="checkout-summary-list">
            {cart.map(({ product, quantity }) => (
              <div className="checkout-summary-row" key={product._id}>
                <div className="checkout-summary-item-info">
                  <img
                    className="checkout-summary-img"
                    src={product.picture?.src ?? "/placeholder.png"}
                    alt={product.name}
                  />
                  <div>
                    <p className="checkout-summary-name">{product.name}</p>
                    <p className="checkout-summary-qty">Qty: {quantity} &nbsp;|&nbsp; ID: {product._id}</p>
                  </div>
                </div>
                <span className="checkout-summary-subtotal">
                  ${(Number(product.price) * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="checkout-total-row">
            <span className="checkout-total-label">Total</span>
            <span className="checkout-total-value">${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* ── Customer Info Form ── */}
        <div className="checkout-card checkout-form-card">
          <h2 className="checkout-section-title">Your Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="checkout-form-grid">
              <div className="checkout-form-field full-width">
                <label>Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Smith"
                />
                {errors.name && <p className="checkout-field-error">{errors.name}</p>}
              </div>

              <div className="checkout-form-field full-width">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. jane@example.com"
                />
                {errors.email && <p className="checkout-field-error">{errors.email}</p>}
              </div>
            </div>

            <div className="checkout-form-actions">
              <button
                type="submit"
                className="checkout-btn-submit"
                disabled={submitting}
              >
                {submitting ? "Placing Order…" : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
