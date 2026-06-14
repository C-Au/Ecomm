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

---

## CSS / Styling Notes

Styles live in `ManageProducts.css` (same folder, imported at the top of the JSX file).

### Layout
- `.manage-container` — max-width 1100px, centred with auto margins, `2rem` padding.
- The form and the table each sit inside their own dark card (`.manage-form-card` / `.manage-table-section`) with `background: #141b2d`, `border-radius: 14px`, and a `box-shadow`.

### Form
- `.manage-form-grid` — CSS Grid, two columns. Name and Price share one row; Description and the file input each span the full width via `.full-width`.
- Labels use small uppercase muted text (`#8a9ab0`, `0.82rem`).
- Inputs have a `#0e1422` dark background; border glows `#e94560` on `:focus`.
- Submit button is solid `#e94560`; Cancel button is the neutral dark-blue used elsewhere in the project.

### Table
- No raw HTML `border` attribute — styled entirely via CSS.
- Column notes:
  - `.col-id` — monospace, truncated with `text-overflow: ellipsis`.
  - `.col-price` — accent red `#e94560`, bold.
  - `.col-description` — truncated, muted colour.
  - `.col-actions` — flex row containing Edit and Delete buttons.
- Row hover highlights with `background-color: #192036`.
- Empty state: a single full-width cell with class `.manage-empty` showing "No products yet."

### Buttons
| Class | Style |
|---|---|
| `.manage-back-btn` | Dark blue, slides left on hover |
| `.manage-btn-submit` | Solid red `#e94560` |
| `.manage-btn-cancel` | Neutral dark blue |
| `.manage-btn-edit` | Quiet blue, text turns white on hover |
| `.manage-btn-delete` | Ghost red (transparent bg), fills solid on hover |

---

## Changelog

| Date | Change |
|---|---|
| 13-Jun-2026 | Added `ManageProducts.css`. Replaced all inline styles with CSS classes. Form converted to two-column grid layout. Table restyled (no border attribute, hover rows, truncated columns). Added empty-state row. Added `errors` state and `validate()` for client-side form validation. |
