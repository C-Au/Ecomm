# Checkout.jsx — Notes

## Purpose

The order confirmation page at `/checkout`. Collects the customer's name and email, shows an order summary, and submits the order to the back-end. On success it clears the cart and redirects to the home page.

---

## Imports

- `useNavigate` — React Router hook for programmatic navigation. Used to redirect to `/` after a successful order.
- `axios` — HTTP client for the `POST /orders` request.
- `toast` from `sonner` — shows success/error notifications.
- `useCart` — provides `cart`, `cartTotal`, and `clearCart`.

---

## State Variables

| Variable | Initial | Purpose |
|---|---|---|
| `form` | `{ name: "", email: "" }` | Mirrors the two input fields. |
| `errors` | `{}` | Validation error messages keyed by field name. Empty = no errors. |
| `submitting` | `false` | `true` while the axios POST is in-flight. Disables the submit button to prevent double-submission. |

---

## Functions

### `handleChange(e)`
Standard controlled-input handler. Spreads existing form state and overwrites only the changed field.

### `validate()`
Checks:
- `name` must not be blank.
- `email` must not be blank AND must match a basic email pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).

Returns an object of error messages. Empty object = all valid.

### `handleSubmit(e)`
1. `e.preventDefault()` — stops page refresh.
2. Runs `validate()`. If errors exist, stores them and stops.
3. Sets `submitting = true` (disables the button).
4. Builds `orderPayload`:
   ```js
   {
     name,
     email,
     items: cart.map(({ product, quantity }) => ({ product: product._id, quantity })),
     total: cartTotal
   }
   ```
   Note: only `product._id` (the ObjectId string) is sent, not the full product object. The back-end stores the reference.
5. `axios.post("http://localhost:8080/orders", orderPayload)` — sends to `POST /orders`.
6. On success: calls `clearCart()`, fires `toast.success(...)`, navigates to `/`.
7. On failure: fires `toast.error(...)`.
8. `.finally()` always resets `submitting = false`.

---

## Empty Cart Guard

If the user navigates to `/checkout` with an empty cart, the component renders an early return with a message and a Back to Cart button. This prevents submitting an empty order.

---

## JSX Notes

- Two-panel layout (`.checkout-layout`) on wider screens:
  - **Left panel** (`.checkout-summary`) — order summary table showing product thumbnail, name, quantity, ID, and subtotal per item. Total row at the bottom.
  - **Right panel** (`.checkout-form-card`) — customer info form (Name + Email fields).
- `product.picture?.src ?? "/placeholder.png"` — same pattern as Cart and SingleProduct.
- `{submitting ? "Placing Order…" : "Place Order"}` — the button text changes while the request is in-flight.
- `disabled={submitting}` — prevents the user from clicking submit twice.
- Inline error messages below each field (`{errors.name && <p>...`).

---

## CSS / Styling Notes

Styles live in `Checkout.css` (same folder). Follows the same dark-theme pattern as the rest of the project:
- `.checkout-container` — max-width, centred, `2rem` padding.
- `.checkout-layout` — two-column grid on wide screens, stacks vertically on mobile.
- `.checkout-card` — dark card `#141b2d`, `border-radius: 14px`, `box-shadow`.
- `.checkout-total-row` — accent red `#e94560` for the total value.
- `.checkout-btn-submit` — solid red, disabled opacity when `submitting`.

---

## Files

| File | Role |
|---|---|
| `pages/Checkout/Checkout.jsx` | **NEW** — checkout page |
| `pages/Checkout/Checkout.css` | **NEW** — checkout page styles |
| `src/App.jsx` | Added `/checkout` route |
| `pages/Cart/Cart.jsx` | Added "Proceed to Checkout →" button linking to `/checkout` |
| `BackEnd/index.js` | Added `POST /orders` endpoint |
| `BackEnd/models/Order.js` | **NEW** — Order schema and model |

---

## Changelog

| Date | Change |
|---|---|
| 20-Jun-2026 | Checkout page built. Created Checkout.jsx + Checkout.css. Created Order model. Added POST /orders to the backend. Added route in App.jsx. Added Proceed to Checkout button in Cart.jsx. |
