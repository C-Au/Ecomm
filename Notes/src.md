# src/ — Notes

## App.jsx

The root component and router of the application. Every React app has one root component at the top of the component tree. `App.jsx`'s job is to:
1. Wrap the entire app in `<CartProvider>` so every component has access to cart state
2. Render the persistent navbar that appears on every page
3. Use React Router to show the correct page based on the URL

### Imports (react-router-dom)

- `Routes` — a container that looks at the current URL and renders the first `<Route>` whose path matches.
- `Route` — pairs a URL path with a component to show.
- `Link` — a navigation element that changes the URL without refreshing the whole page (faster than `<a href>`).

### `NavbarCartIcon` component

A small sub-component defined inside `App.jsx`. Reads `cartCount` from `useCart()` and renders a cart icon in the navbar. Shows a red badge with the item count only when `cartCount > 0`.

```jsx
const { cartCount } = useCart();
```

Defined as a separate function (not inline JSX) so it can call the `useCart` hook — hooks can only be called inside React function components or other hooks.

### `CartProvider`

The entire app is wrapped in `<CartProvider>` (from `CartContext.jsx`). This must sit above the navbar and routes so that all child components — including `NavbarCartIcon` — can access the cart context via `useCart()`.

### `Toaster`

`<Toaster position="top-right" />` from the `sonner` library. Rendered once at the app root so any component can trigger toast notifications anywhere in the app using `toast.success(...)` or `toast.error(...)`.

### JSX Notes

- `className="app-wrapper"` links to a CSS class in `App.css`. In React we use `className` instead of `class` because `class` is a reserved word in JavaScript.
- `<Link to="/manage">` is the React Router equivalent of `<a href="/manage">`. Using `Link` prevents a full page reload — React swaps in the new page instantly without a network round-trip.
- Routes:
  - `path="/"` → `<Home />`
  - `path="/product/:id"` → `<SingleProductPage />`; `:id` is a wildcard available inside the component via `useParams()`
  - `path="/manage"` → `<ManageProducts />`
  - `path="/cart"` → `<Cart />`
  - `path="/checkout"` → `<Checkout />`
- `export default` at the bottom makes `App` available to `main.jsx` which imports it.

---

## CartContextDef.js

Holds only the raw context object created by `createContext()`. Kept in its own file so Vite's Fast Refresh rules are satisfied — a file may not mix a context object export with a component export.

```js
export const CartContext = createContext();
```

---

## CartContext.jsx

Acts as the single source of truth for cart data. Wraps the whole app via `<CartProvider>` in `App.jsx`. See [Cart.md](../Cart.md) for full documentation.

---

## useCart.js

A thin wrapper hook. Calls `useContext(CartContext)` and returns the full context value. Kept in its own file to satisfy Vite Fast Refresh (hooks cannot share a file with a component).

```js
export function useCart() {
  return useContext(CartContext);
}
```

---

## main.jsx

The entry point of the entire React application. The very first file that runs when the browser loads the app. Its only job is to mount the React app onto `index.html`'s `<div id="root">`.

### Imports

- `StrictMode` — a development helper from React. Deliberately runs certain checks twice to catch common mistakes early. No effect in the final production build.
- `createRoot` — how modern React (v18+) attaches itself to the DOM. Replaces the older `ReactDOM.render()` from previous versions.
- `BrowserRouter` — enables React Router. Reads the URL in the address bar and decides which page to show. Must wrap the entire app so every component inside can use routing features like `<Link>` and `useParams`.

### How it works

`document.getElementById("root")` finds the `<div id="root">` in `index.html`. `createRoot()` tells React to take control of that div. `.render()` fills it with the `<App />` component — everything the user sees is rendered inside this single div.

---

## Changelog

### June 20, 2026

- Updated App.jsx section: added `NavbarCartIcon`, `CartProvider`, `<Toaster>`, and `/cart` + `/checkout` routes.
- Added sections for `CartContextDef.js`, `CartContext.jsx`, and `useCart.js`.
