import { Link } from "react-router-dom";
import { useCart } from "../../src/CartContext";
import "./Cart.css";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="cart-container">
      <h1 className="cart-page-title">Shopping Cart</h1>

      <Link to="/">
        <button className="cart-back-btn">← Back to Home</button>
      </Link>

      <div className="cart-card">
        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-table-wrapper">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(({ product, quantity }) => (
                    <tr key={product._id}>
                      <td>
                        <div className="cart-item-info">
                          <img
                            className="cart-item-img"
                            src={product.picture?.src ?? "/placeholder.png"}
                            alt={product.name}
                          />
                          <span className="cart-item-name">{product.name}</span>
                        </div>
                      </td>
                      <td className="cart-col-price">${Number(product.price).toFixed(2)}</td>
                      <td>
                        <div className="cart-qty-controls">
                          <button
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(product._id, -1)}
                          >
                            −
                          </button>
                          <span className="cart-qty-value">{quantity}</span>
                          <button
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(product._id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="cart-col-subtotal">
                        ${(Number(product.price) * quantity).toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="cart-btn-remove"
                          onClick={() => removeFromCart(product._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">${cartTotal.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
