import { Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home/Home";
import SingleProductPage from "../pages/SingleProductPage/SingleProductPage";
import "./App.css";

function App() {
  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <span className="navbar-brand">SHOP<span>HAUS</span></span>
      </nav>

      <div className="page-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<SingleProductPage />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;

/*

Next task Apr 22, 2026:
+update the home page with some better CSS
+Edit products page which contains a form; look skool.com html form if not there google search 

FRONT END:
+ Home page that shows all products in a nice order

+ Specific product page to show a product

+ Sellers page to view their products

+ Sellers page to create and edit products

Checkout page to buy stuff
  - Review Cart
  - Enter shipping info
  - Enter payment detials with stripe

Backend:
Way to store products
Way to create products
Way to Edit products
Delete products

Get all products
Get a specific product

Auth (later)

{
OrderId: 234324324
OrderName: "Joseph Abate"
OrderDate; Today
Items: [item1, item2, item3]
OrderOwnerId: 3248348
}

GET MY ORDERS:
GetAll Reocrds where OrderOwnerId = CurrentSessionUser

*/
