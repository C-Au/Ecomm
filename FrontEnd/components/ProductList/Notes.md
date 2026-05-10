# ProductList.jsx — Notes

## What This Component Does

1. Asks the back-end for the full product list when it loads
2. Shows a loading message while waiting
3. Shows an error message if something goes wrong
4. Passes the products to `<SlideDeck>` to display them

---

## Imports

- **`SingleProduct`** / **`SlideDeck`** — child components rendered inside this one
- **`useEffect`** — runs code at a specific moment (e.g. on page load)
- **`useState`** — stores data that can change and trigger a re-render
- **`Link`** — navigates to another page without a full reload
- **`axios`** — library for making HTTP requests to the back-end

---

## State Variables

| Variable | Initial Value | Purpose |
|---|---|---|
| `products` | `[]` | Array of product objects loaded from the DB. Filled in once the axios call succeeds. |
| `loading` | `true` | `true` while waiting for the server response. Used to show a "Loading…" message. |
| `error` | `null` | Stores an error message string if the request fails, or `null` when everything is fine. |

---

## useEffect

- The empty dependency array `[]` means it runs **once** after the component first appears on screen — perfect for fetching initial data.
- Uses `axios.get` to call `GET /products` on the back-end.

### Inside `.then()`

- **`response?.data`** — optional chaining (`?.`): gets `response.data`, but if `response` is `null` or `undefined`, returns `undefined` instead of crashing.
- **`Array.isArray(data)`** — checks that the server sent back an array. If the server sent something unexpected (e.g. an error message string), we catch it here and show a safe error.
- On success: saves the products array into state so React re-renders the component.

### `.catch()`

Runs if the request itself failed (e.g. server is offline, network error).

### `.finally()`

Always runs after the request finishes, whether it succeeded or failed. Used to turn off the loading state in both cases.

---

## Early Returns

If still loading or an error occurred, the component returns a simple message instead of the full product grid. React will not render anything else past an early return.

---

## JSX — Rendering Products

`products.map()` loops over the products array and converts each product object `p` into a JSX element.

For each product a `<Link>` is created that navigates to that product's detail page (e.g. `/product/6641a2f3...`). Inside the link, `<SingleProduct />` is rendered.

The resulting array of JSX elements is passed to `<SlideDeck items={...} />` which shows them one at a time.

---

## Previous Approach (commented out)

An older version rendered all products as a plain list using `.map()` directly, without `SlideDeck`. It is kept in a comment for reference.
