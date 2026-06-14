import { useCart } from "../../src/CartContext";
import "./SingleProduct.css";

function SingleProduct({ product }) {
  const { addToCart } = useCart();
  console.log(product.picture);
  return (
    <div className="product-card">
      <img
        className="product-card-image"
        src={product.picture?.src ?? "/placeholder.png"}
        alt={product.name}
      />
      <div className="product-card-body">
        <h4 className="product-card-name">{product.name}</h4>
        <p className="product-card-description">{product.description}</p>
        <span className="product-card-price">${product.price}</span>
        <button
          className="product-card-add-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default SingleProduct;
