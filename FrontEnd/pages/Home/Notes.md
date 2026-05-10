# Home.jsx — Notes

## Purpose

The landing page shown when the user visits the root URL `/`. Renders a hero banner and the `<ProductList />` component.

## Design Pattern

Keeping the page simple is a good React pattern: each component has one job, and pages just arrange them. Home's only job is layout — `ProductList` handles data fetching and display.

## JSX Notes

- `<span className="accent">` — applies a highlight colour to just "ShopHaus" via CSS.
- `<ProductList />` — custom component from `components/ProductList/ProductList.jsx`. React renders whatever that component returns in its place.
