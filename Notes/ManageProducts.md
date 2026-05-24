# ManageProducts.jsx — Notes

## Purpose

The "Seller Admin" page. Has two parts:
1. A **form** at the top — used to both ADD new products and EDIT existing ones (switches modes automatically).
2. A **table** at the bottom — lists every product with Edit and Delete buttons on each row.

---

## State Variables

| Variable | Initial | Purpose |
|---|---|---|
| `products` | `[]` | All products loaded from the back-end. |
| `editingId` | `null` | `null` = ADD mode; any ID string = EDIT mode for that product. |
| `form` | `{ name, price, description }` | Mirrors the input fields. Each starts as `""`. |
| `picture` | `null` | The selected image file, stored separately from the text fields. |

---

## Functions

### `useEffect` (load on mount)
Empty `[]` dependency array = runs once on page load. Fetches all products and stores them in `products` state.

### `handleChange(e)`
One function handles ALL input fields.
- `e.target.name` matches the `name` attribute on each `<input>`.
- `e.target.value` is what the user typed.
- Spread operator: `{ ...form, [e.target.name]: e.target.value }` copies all existing fields, then overwrites only the one that changed.
- Special case: if `name === "picture"`, stores `e.target.files[0]` in the separate `picture` state.

### `handleSubmit(e)`
- `e.preventDefault()` stops the browser from refreshing the page on form submit.
- **ADD mode** (`editingId === null`): sends `POST /products/add` with `multipart/form-data`. On success, appends new product: `[...products, response.data]`.
- **EDIT mode**: sends `PUT /products/edit/:id`. On success, replaces the old product using `.map()`.

### `handleEditClick(product)`
Switches to EDIT mode: stores the product's ID in `editingId` and pre-fills `form` with its current values.

### `handleDelete(productId)`
- Shows a `window.confirm()` browser popup as a safety check.
- Sends `DELETE /products/delete/:id`. On success, removes the product with `.filter()` — keeps every product whose ID is NOT the deleted one.

### `handleCancel()`
Exits EDIT mode and clears the form (resets `editingId` to `null`).

---

## JSX Notes

- Form heading toggles: `editingId ? "✏️ Edit Product" : "➕ Add New Product"`.
- Each `<input>` has `name`, `value`, and `onChange` — this is a **controlled input** (React is always in charge of the displayed value). `required` makes the browser refuse to submit if left empty.
- `{editingId && <button>Cancel</button>}` — the `&&` operator renders the Cancel button only in EDIT mode.
- `() => handleEditClick(p)` — arrow function wrapper delays the call until the button is clicked. Without it, the function would fire immediately when the page loads.
- `() => handleDelete(p._id)` — same pattern for Delete.
- Table uses `key={p._id}` — required by React for lists so it can track which items changed.
