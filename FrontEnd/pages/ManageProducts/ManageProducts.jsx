import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [picture, setPic] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8080/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        console.error("Could not load products:", err);
      });
  }, []);

  // polling
  // Toast lib npm package
  function handleChange(e) {
    console.log(e.target);
    if (e.target.name === "picture") {
      console.log("1");
      setPic(e.target.files[0]);
    } else {
      console.log("2");
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (isNaN(form.price) || form.price <= 0)
      newErrors.price = "Enter a valid price";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // show errors, stop here
      return;
    }
    // safe to send to backend now

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    if (picture) {
      formData.append("picture", picture);
    }

    if (editingId === null) {
      axios
        .post("http://localhost:8080/products/add", formData)
        .then((response) => {
          setProducts([...products, response.data]);
          setForm({ name: "", price: "", description: "", picture: null });
          setPic(null);
        })
        .catch((err) => {
          console.error("Could not add product:", err);
        });
    } else {
      axios
        .put(`http://localhost:8080/products/edit/${editingId}`, formData)
        .then((response) => {
          setProducts(
            products.map((p) => (p._id === editingId ? response.data : p)),
          );
          setEditingId(null);
          setForm({ name: "", price: "", description: "", picture: null });
        })
        .catch((err) => {
          console.error("Could not update product:", err);
        });
    }
  }

  function handleEditClick(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      picture: product.picture,
    });
  }

  function handleDelete(productId) {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    axios
      .delete(`http://localhost:8080/products/delete/${productId}`)
      .then(() => {
        setProducts(products.filter((p) => p._id !== productId));
      })
      .catch((err) => {
        console.error("Could not delete product:", err);
      });
  }

  function handleCancel() {
    setEditingId(null);
    setForm({ name: "", price: "", description: "", picture: null });
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <button style={{ marginBottom: "1rem" }}>← Back to Home</button>
      </Link>

      <h1>Manage Products</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <h2>{editingId ? "✏️ Edit Product" : "➕ Add New Product"}</h2>

        <div>
          <label>Product Name</label>
          <br />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Wireless Mouse"
            required
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div>
          <label>Price</label>
          <br />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="e.g. 19.99"
            required
          />
          {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
        </div>

        <div>
          <label>Description</label>
          <br />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g. A smooth wireless mouse."
            required
          />
          {errors.description && (
            <p style={{ color: "red" }}>{errors.description}</p>
          )}
        </div>

        <div>
          <label>Image Filename</label>
          <br />
          <input name="picture" onChange={handleChange} type="file" />
        </div>

        <button type="submit">
          {editingId ? "Save Changes" : "Add Product"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
            style={{ marginLeft: "1rem" }}
          >
            Cancel
          </button>
        )}
      </form>

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
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
                <button onClick={() => handleEditClick(p)}>Edit</button>
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
