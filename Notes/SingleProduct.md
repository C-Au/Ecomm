# SingleProduct.jsx — Notes

## Purpose

A reusable product card component used in two places:
1. `ProductList.jsx` — one card per product in the grid
2. `SingleProductPage.jsx` — the detail view for one product

## Props

Data is received through **props** (short for properties) — how a parent component passes data down to a child.

`{ product }` is **destructuring** the props object. It is shorthand for:
```js
function SingleProduct(props) { const product = props.product; }
```
The parent passes it like: `<SingleProduct product={p} />`

## JSX Notes

- `alt={product.name}` — sets alt text for accessibility; screen readers and search engines use it to understand the image.
- `{}` curly braces — embed a JavaScript expression inside JSX.
- `{product.name}`, `{product.description}`, `{product.price}` — each renders the matching value from the product prop.
- `$` is plain text; `{product.price}` inserts the number, together rendering e.g. `$19.99`.
