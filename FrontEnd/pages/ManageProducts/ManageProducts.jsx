import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'sonner';
import "./ManageProducts.css";

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
          toast.success('Product added!')
          // closeButton
        })
        .catch((err) => {
          console.error("Could not add product:", err);
          toast.error('Could not add product')
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
    <div className="manage-container">
      <h1 className="manage-page-title">Manage Products</h1>

      <Link to="/">
        <button className="manage-back-btn">← Back to Home</button>
      </Link>

      <div className="manage-form-card">
        <form onSubmit={handleSubmit}>
          <h2 className="manage-form-title">
            {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>

          <div className="manage-form-grid">
            <div className="manage-form-field">
              <label>Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Mouse"
                required
              />
              {errors.name && <p className="manage-field-error">{errors.name}</p>}
            </div>

            <div className="manage-form-field">
              <label>Price</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 19.99"
                required
              />
              {errors.price && <p className="manage-field-error">{errors.price}</p>}
            </div>

            <div className="manage-form-field full-width">
              <label>Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. A smooth wireless mouse."
                required
              />
              {errors.description && (
                <p className="manage-field-error">{errors.description}</p>
              )}
            </div>

            <div className="manage-form-field full-width">
              <label>Product Image</label>
              <input name="picture" onChange={handleChange} type="file" />
            </div>
          </div>

          <div className="manage-form-actions">
            <button type="submit" className="manage-btn-submit">
              {editingId ? "Save Changes" : "Add Product"}
            </button>
            {editingId && (
              <button type="button" className="manage-btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="manage-table-section">
        <h2 className="manage-table-title">All Products</h2>
        <div className="manage-table-wrapper">
          <table className="manage-table">
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="manage-empty">No products yet.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td className="col-id">{p._id}</td>
                    <td>{p.name}</td>
                    <td className="col-price">${p.price}</td>
                    <td className="col-description">{p.description}</td>
                    <td>
                      <div className="col-actions">
                        <button className="manage-btn-edit" onClick={() => handleEditClick(p)}>Edit</button>
                        <button className="manage-btn-delete" onClick={() => handleDelete(p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
