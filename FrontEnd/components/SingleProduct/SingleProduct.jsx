function SingleProduct({ product }) {
  return (
    <div>
      <h4>{product.name}</h4>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <img src="" alt={product.name} height="200px" width="200px" />
    </div>
  );
}

export default SingleProduct;
