// ============================================================
// SingleProduct.jsx — A reusable product card component
//
// This component is used in two places:
//   1. ProductList.jsx  — renders one card per product in the grid
//   2. SingleProductPage.jsx — renders the detail view for one product
//
// It receives data through "props" — short for properties.
// Props are how a parent component passes data down to a child.
// ============================================================

import "./SingleProduct.css";

// { product } is "destructuring" the props object.
// It is shorthand for: function SingleProduct(props) { const product = props.product; }
// The parent passes the product like this: <SingleProduct product={p} />
function SingleProduct({ product }) {
  return (
    <div className="product-card">

      {/* alt={product.name} sets the alt text for accessibility.
          Screen readers and search engines use it to understand
          what the image shows.  In JSX, curly braces {} let us
          embed a JavaScript expression inside HTML-like code. */}
      <img className="product-card-image" src="" alt={product.name} />

      <div className="product-card-body">
        {/* Each piece of data comes from the product prop passed
            in by the parent.  If product.name is "Wireless Mouse"
            then {product.name} renders the text "Wireless Mouse". */}
        <h4 className="product-card-name">{product.name}</h4>
        <p className="product-card-description">{product.description}</p>

        {/* The $ is plain text; {product.price} inserts the number.
            Together they render as e.g. "$19.99". */}
        <span className="product-card-price">${product.price}</span>
      </div>
    </div>
  );
}

export default SingleProduct;
