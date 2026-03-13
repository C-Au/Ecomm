import { Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home/Home";
import "./App.css";

function App() {
  return (
    <div>
      <p>HOME PAGE</p>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;

/*
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
