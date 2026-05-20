import "./SingleProduct.css";

function SingleProduct({ product }) {
  console.log(product.picture)
  return (
    <div className="product-card">
      <img
        className="product-card-image"
        src={product.picture.src}
        alt={product.name}
      />
      <div className="product-card-body">
        <h4 className="product-card-name">{product.name}</h4>
        <p className="product-card-description">{product.description}</p>
        <span className="product-card-price">${product.price}</span>
      </div>
    </div>
  );
}

export default SingleProduct;
