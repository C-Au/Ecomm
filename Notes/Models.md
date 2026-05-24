# Product.js — Notes

## Purpose

Defines the **Product blueprint** (Schema + Model) used by Mongoose to read and write products in MongoDB.

In MongoDB, data is stored as documents (similar to JSON objects). Before we can save a product, we need to tell MongoDB exactly what fields a product has and what type each field should be. That is what this file does.

---

## The Schema

A **Schema** is the blueprint (or template) for a document. Think of it like designing a form: you decide in advance what fields the form has and whether each one is required.

Each field gets an object that describes it:

| Option | Purpose |
|---|---|
| `type` | What kind of data it holds (`String`, `Number`, `Date`, etc.) |
| `required` | If `true`, MongoDB will refuse to save the document if this field is missing |
| `default` | A value used automatically when the field is not provided at all |

MongoDB automatically adds:
- `_id` — a unique ID for every document (we do not have to create this ourselves)
- `__v` — a version key Mongoose uses internally (can be ignored)

### Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `String` | Yes | Product name |
| `price` | `Number` | Yes | Product price |
| `description` | `String` | Yes | Product description |
| `picture` | `Mixed` | No | Accepts any value — either a plain string (legacy) or an object with `{ fileName, fileType, fileSize, fileData }` |

`mongoose.Schema.Types.Mixed` is used for `picture` so that Mongoose does not try to cast the value into a specific shape. This allows the field to hold both old string values and new file-object values stored in the database.

---

## The Model

`mongoose.model()` takes the Schema and creates a **Model** — a JavaScript class that knows how to talk to MongoDB.

- The first argument (`"Product"`) is the model name. Mongoose automatically creates a collection called `products` in the database (lowercase + plural of the model name).
- `module.exports` makes this Model available to any other file that does `require('./models/Product')`.

### Methods Available on the Model

| Method | What it does |
|---|---|
| `Product.find()` | Get all products |
| `Product.findById(id)` | Get one product by its `_id` |
| `new Product({...}).save()` | Create and save a new product |
| `Product.findByIdAndUpdate(id, data, opts)` | Edit an existing product |
| `Product.findByIdAndDelete(id)` | Delete a product |
