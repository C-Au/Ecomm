// ============================================================
// ManageProducts.jsx
//
// This is the "Seller Admin" page.  It has two parts:
//   1. A FORM at the top — used to both ADD new products and
//      EDIT existing ones (it switches modes automatically).
//   2. A TABLE at the bottom — lists every product with an
//      Edit button and a Delete button on each row.
// ============================================================

// Import the React hooks we need.
// useState  — lets us store data that can change over time (like
//             what the user is currently typing into the form).
// useEffect — lets us run code at specific moments, like when
//             the page first loads.
import { useState, useEffect } from "react";

// Link is the React Router component for navigating between pages
// without a full page reload — the same way the navbar uses it.
import { Link } from "react-router-dom";

// axios is our tool for making HTTP requests to the back-end.
// It is the same one used in ProductList.jsx and SingleProductPage.jsx.
import axios from "axios";


// ============================================================
// The component function.  Everything inside this function is
// the "brain" and the "display" of the page combined.
// ============================================================
export default function ManageProducts() {

  // ----------------------------------------------------------
  // STATE VARIABLES
  //
  // Think of state variables like sticky notes the component
  // keeps on its desk.  Whenever a sticky note changes,
  // React automatically redraws the page to reflect the change.
  // ----------------------------------------------------------

  // products — the list of all products loaded from the back-end.
  // We start with an empty array [] and fill it on page load.
  const [products, setProducts] = useState([]);

  // editingId — tracks WHICH product we are currently editing.
  //   null   = we are in ADD mode (the form will create a new product)
  //   "839201" (any id string) = we are in EDIT mode for that product
  const [editingId, setEditingId] = useState(null);

  // form — an object that mirrors the four input fields in the form.
  // Every field starts as an empty string "".
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: ""
  });

  const [picture, setPic] = useState(null);


  // ----------------------------------------------------------
  // STEP 2A — LOAD PRODUCTS WHEN THE PAGE FIRST OPENS
  //
  // useEffect with an empty array [] as the second argument means
  // "run this once, right after the page loads for the first time."
  // We ask the back-end for all products and save them in state.
  // ----------------------------------------------------------
  useEffect(() => {
    axios
      .get("http://localhost:8080/products")
      .then((response) => {
        // response.data is the array of products the server returned.
        // We store it in our products state variable.
        setProducts(response.data);
      })
      .catch((err) => {
        // If something goes wrong (e.g. server is off), print it.
        console.error("Could not load products:", err);
      });
  }, []); // <-- the empty [] means "only run once on page load"


  // ----------------------------------------------------------
  // STEP 2B — HANDLE TYPING IN ANY INPUT FIELD
  //
  // Instead of writing a separate function for each input,
  // we write one function that handles ALL inputs.
  //
  // When the user types in any field, this function fires.
  // "e" is the event — it contains info about what happened.
  // e.target is the input element the user typed into.
  // e.target.name is the "name" attribute we set on that input.
  // e.target.value is what the user typed.
  //
  // The spread operator ...form copies all existing fields,
  // then [e.target.name]: e.target.value overwrites just the
  // one field that changed.  The result is a new updated object.
  // ----------------------------------------------------------
  function handleChange(e) {
    console.log(e.target)
    if (e.target.name === "picture") {
      console.log("1")
      setPic(e.target.files[0]);
    } else {
      console.log("2")

      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }


  // ----------------------------------------------------------
  // STEP 2C — HANDLE FORM SUBMISSION (ADD or EDIT)
  //
  // This function runs when the user clicks the submit button.
  // It checks whether we are in ADD mode or EDIT mode and sends
  // the correct type of request to the back-end.
  // ----------------------------------------------------------
  function handleSubmit(e) {
    // e.preventDefault() stops the browser's default behaviour
    // of refreshing the whole page when a form is submitted.
    // Without this line, the page would reload and all data
    // would disappear.
    e.preventDefault();

    console.log(form)

    if (editingId === null) {
      // ---- ADD MODE ----
      // We are NOT editing an existing product, so we POST a new one.
      // axios.post(url, data) sends the form data to the back-end.
      axios
        .post("http://localhost:8080/products/add", 
          {...form, picture},
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }            
          })
        .then((response) => {
          // The server returns the newly created product (with its
          // new ID).  We add it to our products list using the
          // spread operator: [...products, response.data] means
          // "all the old products, plus this new one at the end."
          setProducts([...products, response.data]);

          // Clear the form fields so it is ready for the next product
          setForm({ name: "", price: "", description: "", picture: null });
        })
        .catch((err) => {
          console.error("Could not add product:", err);
        });

    } else {
      // ---- EDIT MODE ----
      // editingId holds the ID of the product we are updating.
      // We send a PUT request with the updated form data.
      axios
        .put(`http://localhost:8080/products/edit/${editingId}`, form)
        .then((response) => {
          // The server returns the updated product.
          // We use .map() to loop over our products list and swap
          // the old version for the new one.  For every product:
          //   - if its ID matches editingId → replace it with response.data
          //   - otherwise → keep it as is (the "p" stays the same)
          setProducts(
            products.map((p) =>
              p._id === editingId ? response.data : p
            )
          );

          // Exit edit mode and clear the form
          setEditingId(null);
          setForm({ name: "", price: "", description: "", picture: null });
        })
        .catch((err) => {
          console.error("Could not update product:", err);
        });
    }
  }


  // ----------------------------------------------------------
  // STEP 2D — HANDLE CLICKING THE "EDIT" BUTTON ON A ROW
  //
  // When the user clicks Edit on a product row, two things happen:
  //   1. We store that product's ID in editingId (switches mode)
  //   2. We pre-fill the form fields with that product's current data
  //      so the user sees what they are editing
  // ----------------------------------------------------------
  function handleEditClick(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      picture: product.picture,
    });
  }


  // ----------------------------------------------------------
  // STEP 2E — HANDLE CLICKING THE "DELETE" BUTTON ON A ROW
  //
  // We send a DELETE request for the product's ID.
  // If the server confirms deletion, we remove it from our local
  // list using .filter() — which keeps every item EXCEPT the
  // one whose ID matches the deleted product.
  // ----------------------------------------------------------
  function handleDelete(productId) {
    // Ask the user to confirm before deleting — this is a safety
    // check so they do not delete something by accident.
    // window.confirm() shows a browser popup with OK / Cancel.
    // If they click Cancel, confirm() returns false and we stop here.
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    axios
      .delete(`http://localhost:8080/products/delete/${productId}`)
      .then(() => {
        // Remove the deleted product from the list.
        // .filter() keeps only items where the condition is TRUE.
        // "keep every product whose ID is NOT the deleted one"
        setProducts(products.filter((p) => p._id !== productId));
      })
      .catch((err) => {
        console.error("Could not delete product:", err);
      });
  }


  // ----------------------------------------------------------
  // STEP 2F — HANDLE CLICKING THE "CANCEL" BUTTON
  //
  // If the user clicks Cancel while editing, we go back to ADD
  // mode and clear the form.
  // ----------------------------------------------------------
  function handleCancel() {
    setEditingId(null);
    setForm({ name: "", price: "", description: "", picture: null });
  }


  // ----------------------------------------------------------
  // STEP 2G — THE JSX (what the page looks like)
  //
  // JSX looks like HTML but lives inside JavaScript.
  // React will convert this into real HTML in the browser.
  //
  // We return ONE root element (the outer <div>).  Everything
  // else must be nested inside it.
  // ----------------------------------------------------------
  return (
    <div style={{ padding: "2rem" }}>

      {/* -------------------------------------------------------
          HOME BUTTON
          <Link to="/"> points back to the root URL, which is the
          Home page as defined in App.jsx.  We style it to look
          like a button using inline styles.  "textDecoration: none"
          removes the default underline that links have.
      ------------------------------------------------------- */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <button style={{ marginBottom: "1rem" }}>← Back to Home</button>
      </Link>

      <h1>Manage Products</h1>

      {/* -------------------------------------------------------
          THE FORM
          onSubmit={handleSubmit} wires the submit button to our
          handleSubmit function above.
          The heading changes based on which mode we are in.
      ------------------------------------------------------- */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>

        <h2>{editingId ? "✏️ Edit Product" : "➕ Add New Product"}</h2>

        {/* Each input has:
            - name="..." which MUST match the key in our form state object
            - value={form.name} which keeps the input "controlled" — React
              is always in charge of what is displayed
            - onChange={handleChange} which fires our typing handler
            - required makes the browser refuse to submit if left empty   */}

        <div>
          <label>Product Name</label><br />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Wireless Mouse"
            required
          />
        </div>

        <div>
          <label>Price</label><br />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="e.g. 19.99"
            required
          />
        </div>

        <div>
          <label>Description</label><br />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g. A smooth wireless mouse."
            required
          />
        </div>

        <div>
          <label>Image Filename</label><br />
          <input
            name="picture"
            onChange={handleChange}
            type="file"
          />
        </div>

        {/* The submit button label changes depending on the mode */}
        <button type="submit">
          {editingId ? "Save Changes" : "Add Product"}
        </button>

        {/* Only show the Cancel button when we are in EDIT mode.
            The && operator means "if editingId is truthy, render
            the button; otherwise render nothing."                */}
        {editingId && (
          <button type="button" onClick={handleCancel} style={{ marginLeft: "1rem" }}>
            Cancel
          </button>
        )}

      </form>


      {/* -------------------------------------------------------
          THE PRODUCT TABLE
          We loop over the products array and create one table row
          per product using .map().
          key={p.productId} is required by React when creating
          lists — it helps React track which items changed.
      ------------------------------------------------------- */}
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p._id}</td>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.description}</td>
              <td>
                {/* Clicking Edit calls handleEditClick and passes
                    the whole product object "p" to it.
                    () => handleEditClick(p) is an arrow function —
                    it is a way to delay the call until the button
                    is actually clicked.  Without the () => wrapper,
                    the function would fire immediately when the page
                    loads, not when the button is clicked.           */}
                <button onClick={() => handleEditClick(p)}>Edit</button>

                {/* Same idea for Delete — we pass just the ID */}
                <button
                  onClick={() => handleDelete(p._id)}
                  style={{ marginLeft: "0.5rem", color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}