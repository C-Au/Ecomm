# SingleProduct.jsx — Notes

## Purpose

A reusable product card component used in two places:
1. `ProductList.jsx` — one card per product in the slide deck
2. `SingleProductPage.jsx` — the detail view for one product

## Cart Integration

Uses the `useCart` hook to access `addToCart`:

```js
const { addToCart } = useCart();
```

The "Add to Cart" button calls `addToCart(product)` when clicked:

```jsx
<button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }}
>
  Add to Cart
</button>
```

- `e.preventDefault()` prevents the click from triggering a parent `<form>` submit if any.
- `e.stopPropagation()` stops the click from bubbling up to a parent `<Link>` element — important because in `ProductList.jsx` each card is wrapped in a `<Link>`. Without this, clicking "Add to Cart" would also navigate to the product detail page.

## Props

Data is received through **props** (short for properties) — how a parent component passes data down to a child.

`{ product }` is **destructuring** the props object. It is shorthand for:
```js
function SingleProduct(props) { const product = props.product; }
```
The parent passes it like: `<SingleProduct product={p} />`

## JSX Notes

- `product.picture?.src ?? "/placeholder.png"` — optional chaining gets the data URL built by the server. Falls back to `/placeholder.png` if no picture was uploaded.
- `alt={product.name}` — sets alt text for accessibility; screen readers and search engines use it to understand the image.
- `{}` curly braces — embed a JavaScript expression inside JSX.
- `{product.name}`, `{product.description}`, `{product.price}` — each renders the matching value from the product prop.
- `$` is plain text; `{product.price}` inserts the number, together rendering e.g. `$19.99`.

---

## Changelog

### June 20, 2026
- Updated notes to document `useCart` integration, `addToCart` button, and `e.stopPropagation()` rationale.
- Added picture `src` fallback note.
