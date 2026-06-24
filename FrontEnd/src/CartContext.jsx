import { useState, useEffect } from "react";
import { CartContext } from "./CartContextDef.js";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("shophaus-cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("shophaus-cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);

      if (existing) {
        return prev.map((item) => {
          if (item.product._id === product._id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }

          return item;
        });
      }

      return [...prev, { product, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  }

  function updateQuantity(productId, delta) {
    setCart((prev) => {
      const updatedItems = prev.map((item) => {
        if (item.product._id === productId) {
          return {
            ...item,
            quantity: item.quantity + delta,
          };
        }

        return item;
      });

      const nonZeroItems = updatedItems.filter((item) => {
        return item.quantity > 0;
      });

      return nonZeroItems;
    });
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
