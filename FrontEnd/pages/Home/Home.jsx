import ProductList from "../../components/ProductList/ProductList";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h2>
          Welcome to <span className="accent">ShopHaus</span>
        </h2>
        <p>Browse our latest products and find something you love.</p>
      </div>
      <ProductList />
    </div>
  );
}

export default Home;
