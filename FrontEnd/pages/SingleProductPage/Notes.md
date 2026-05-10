# SingleProductPage.jsx — Notes

## Purpose

The detail page for one product. Shown when the user clicks a product card. The URL looks like `/product/6641a2f3c7b...`. React Router captures the `id` from the URL and this component uses it to fetch just that one product from the back-end.

## Imports

- `useParams` — reads dynamic parts of the URL. For the route `/product/:id`, `useParams()` returns `{ id: "..." }` where the value is whatever is in the actual URL.

## State

| Variable | Initial | Purpose |
|---|---|---|
| `product` | `null` | `null` means "not loaded yet". Filled in once the axios call finishes. |
| `loading` | `true` | Show a message while waiting for the server. |
| `error` | `null` | Store an error message string if the request fails. |

## useEffect

- Dependency array `[id]` means: re-run whenever the `id` value changes. This handles the case where the user navigates directly from one product page to another.
- Uses a **template literal** (backtick string) to embed `id` into the URL: `` `http://localhost:8080/product/search_id/${id}` ``

## Commented-Out Code

A placeholder `useEffect` for loading related products by category — to be implemented in a future update.

## Early Returns

Same pattern as `ProductList.jsx`: return early with a simple message while data is not ready.

## JSX Notes

- `<SingleProduct product={product} />` — passes the loaded product object down as a prop. `SingleProduct` reads `product.name`, `product.price`, etc. and renders the card.
- Placeholder `<div>` inside JSX for future related-products feature.
