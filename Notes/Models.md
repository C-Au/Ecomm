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
| `picture` | Object | No | A nested object with five sub-fields (see below). The whole field is optional — products can exist without a picture. |

### `picture` Sub-fields

| Sub-field | Type | Notes |
|---|---|---|
| `filename` | `String` | Original name of the uploaded file |
| `filetype` | `String` | MIME type of the file (e.g. `image/jpeg`) |
| `size` | `Number` | File size in bytes |
| `data` | `String` | The image stored as a base64-encoded string |
| `src` | `String` | A ready-to-use data URL built from `filetype` and `data` (e.g. `` `data:image/jpeg;base64,...` ``). Added by the server before sending to the front-end so `<img src>` can display it directly. |

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

---

# Order.js — Notes

## Purpose

Defines the **Order blueprint** (Schema + Model) used by Mongoose to save customer orders in MongoDB. An order is created when the user completes the checkout flow.

---

## The Schema

### Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `String` | Yes | Customer's full name |
| `email` | `String` | Yes | Customer's email address |
| `items` | `Array` | Yes | Array of `{ product, quantity }` objects (see below) |
| `total` | `Number` | Yes | Grand total in dollars, pre-calculated by the front-end |
| `createdAt` | `Date` | No | Defaults to `Date.now` — automatically set to the current timestamp when the order is saved |

### `items` Sub-fields

Each element in `items` is an object with:

| Sub-field | Type | Required | Notes |
|---|---|---|---|
| `product` | `ObjectId` | Yes | References the `Product` collection (`ref: "Product"`). Mongoose can populate this to get the full product object if needed. |
| `quantity` | `Number` | Yes | How many units of this product were ordered |

The `ref: "Product"` option enables Mongoose's `.populate()` in future queries to replace the ObjectId with the actual Product document.

---

## The Model

`mongoose.model("Order", orderSchema)` creates the Model and maps to a `orders` collection in MongoDB.

### Methods Available on the Model

| Method | What it does |
|---|---|
| `new Order({...}).save()` | Create and save a new order |
| `Order.find()` | Get all orders |
| `Order.findById(id)` | Get one order by its `_id` |
