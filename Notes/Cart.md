# Cart Feature — Notes

Covers four files that work together:
- `FrontEnd/src/CartContext.js` — the context object
- `FrontEnd/src/CartContext.jsx` — global state and logic (`CartProvider`)
- `FrontEnd/src/useCart.js` — `useCart` hook
- `FrontEnd/pages/Cart/Cart.jsx` + `Cart.css` — the `/cart` page

---

## Overview

The shopping cart is built with **React Context** so any component in the tree can read or update the cart without prop drilling. The cart state is persisted to `localStorage` so it survives page refreshes.

---

## CartContext.js

### Purpose
Holds only the raw context object created by `createContext()`. Kept in its own file so Vite's Fast Refresh rules are satisfied — a file may not mix a context object export with a component export.

```js
export const CartContext = createContext();
```

---

## CartContext.jsx

### Purpose
Acts as the single source of truth for cart data. Wraps the whole app via `<CartProvider>` in `App.jsx`.

### State
| Variable | Type | Purpose |
|---|---|---|
| `cart` | `Array` | List of `{ product, quantity }` objects. Initialised from `localStorage`. |

### Derived Values (computed, not state)
| Value | How |
|---|---|
| `cartCount` | `cart.reduce(sum + quantity)` — total number of items (shown in navbar badge). |
| `cartTotal` | `cart.reduce(sum + price * quantity)` — grand total in dollars. |

### Functions

#### `addToCart(product)`
- Checks if the product already exists in the cart by `_id`.
- If yes: increments its `quantity` by 1 using `.map()`.
- If no: appends `{ product, quantity: 1 }` to the array.

#### `removeFromCart(productId)`
Filters out the item whose `product._id` matches — removes it entirely regardless of quantity.

#### `updateQuantity(productId, delta)`
- `delta` is `+1` or `-1`.
- Maps over the cart, adds delta to the matching item's quantity.
- Chains `.filter(item => item.quantity > 0)` — if quantity hits 0, the item is automatically removed.

### localStorage Persistence
- The initial state uses a **lazy initialiser** function: `useState(() => { ... })`. This runs once on mount and reads from `localStorage`.
- A `useEffect` with `[cart]` dependency writes the cart back to `localStorage` every time `cart` changes.
- Key used: `"shophaus-cart"`.

### `useCart()` hook
Moved to its own file (`src/useCart.js`) to satisfy Vite Fast Refresh — hooks are not components and cannot share a file with one. Import from `useCart.js`:

```js
import { useCart } from "../../src/useCart";
```

Calls `useContext(CartContext)` and returns the full context value.

```js
const { cart, addToCart, cartCount, cartTotal } = useCart();
```

---

## Cart.jsx (the page)

### Purpose
Displays the full cart at the `/cart` route. Lets users adjust quantities, remove items, and see a running total.

### What it renders
- Page title + Back to Home button (matches ManageProducts layout pattern).
- A dark card wrapping a table — columns: Product (thumbnail + name), Price, Quantity, Subtotal, Remove.
- Empty state paragraph when `cart.length === 0`.
- A total row at the bottom showing the grand total.

### JSX Notes
- `cart.map(({ product, quantity }) => ...)` — destructures each cart item inline.
- `e.preventDefault()` / `e.stopPropagation()` on the **Add to Cart** button in `SingleProduct.jsx` prevents a click on the home page cards from navigating away.
- `Number(product.price).toFixed(2)` — ensures the price always renders with two decimal places even if the stored value is an integer.
- `updateQuantity(product._id, -1)` with the auto-remove filter means the minus button doubles as a delete when quantity is 1.

---

## CSS / Styling Notes

Styles live in `Cart.css` (same folder). Pattern is identical to `ManageProducts.css`:
- Dark card: `background: #141b2d`, `border-radius: 14px`, `box-shadow`.
- Table: muted uppercase headers, row hover `#192036`, no HTML `border` attribute.
- Price column accent red `#e94560`.
- Remove button: ghost red, fills solid on hover.
- Qty +/- buttons: dark blue, turn red on hover.

---

## Files Changed / Created

| File | Role |
|---|---|
| `src/CartContext.js` | **NEW** — context object only (split out for Fast Refresh) |
| `src/CartContext.jsx` | **NEW** — `CartProvider` component, state, functions |
| `src/useCart.js` | **NEW** — `useCart` hook (split out for Fast Refresh) |
| `pages/Cart/Cart.jsx` | **NEW** — cart page |
| `pages/Cart/Cart.css` | **NEW** — cart page styles |
| `src/App.jsx` | Wrapped in `<CartProvider>`, added `/cart` route, added navbar cart icon |
| `src/App.css` | Navbar cart icon + badge styles |
| `components/SingleProduct/SingleProduct.jsx` | Added "Add to Cart" button |
| `components/SingleProduct/SingleProduct.css` | Added `.product-card-add-btn` styles |

---

## Changelog

| Date | Change |
|---|---|
| 13-Jun-2026 | Feature built. Created CartContext with localStorage persistence. Created Cart page and CSS. Added Add to Cart button to SingleProduct. Added cart icon with red count badge to navbar. |
| 14-Jun-2026 | Fixed Vite Fast Refresh error. Split `CartContext.jsx` into three files: `CartContext.js` (context object), `CartContext.jsx` (`CartProvider` component only), and `useCart.js` (`useCart` hook). Updated imports in `App.jsx`, `Cart.jsx`, and `SingleProduct.jsx`. |
