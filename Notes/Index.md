# index.js — Notes

## Setup — Load Packages and Configure the Server

- `require('dotenv').config()` reads the `.env` file in this folder and loads its values into `process.env` so we can access them safely (e.g. `process.env.MONGO_URI`). This MUST be the very first line so that every other file that runs after it can also read those environment variables.
- `require('mongoose')` loads Mongoose — a library that lets Node.js talk to MongoDB in a structured, organized way.
- `require('./models/Product')` loads the Product blueprint defined in `models/Product.js`. Used to read and write products in the database.
- `require('express')` loads the Express library — the tool used to create a web server and define URL routes.
- `express()` creates the actual server application.
- `HTTP_PORT` is the port number the server listens on. `process.env.PORT` checks if a hosting service (like Railway or Render) has set a port for us; if not, falls back to `8080`.
- `cors` allows the React front-end (running on a different port like 5173) to make requests to this server. Without it the browser would block those requests for security reasons.
- `multer` handles `multipart/form-data` (file uploads). `multer.memoryStorage()` keeps uploaded files in RAM as a Buffer instead of writing them to disk.

---

## Connect to MongoDB

`mongoose.connect()` opens a connection to the MongoDB database. We pass it the connection string from `.env` — this string contains the username, password, and address of the database.

Because connecting takes a moment (it goes over the internet), `mongoose.connect()` returns a **Promise** — JavaScript's way of saying "I'll let you know when this is done."

- `.then(...)` runs if the connection **succeeds** — logs a confirmation message.
- `.catch(...)` runs if the connection **fails** — logs the error.

Once connected, Mongoose automatically keeps the connection open so every route can query the database.

---

## Middleware

| Call | Purpose |
|---|---|
| `app.use(cors())` | Turns on CORS for every request. By default the browser blocks requests from different origins (ports/domains). `cors()` lifts that restriction. In production you would restrict this to specific allowed origins. |
| `app.use(express.json())` | Tells Express to read JSON data the browser sends. Without this, `req.body` would always be `undefined`. `express.json()` is middleware — it reads the incoming message and converts it to a plain JS object. |
| `app.use(express.static("public"))` | Automatically serves any file inside `/public` as a downloadable file. E.g. `public/photo.jpg` is accessible at `http://localhost:8080/photo.jpg` with no extra route needed. |

---

## Routes

### GET `/` — Test Route
A simple sanity check. Visiting `http://localhost:8080/` in the browser shows the word "Data". Useful for confirming the server started correctly.

---

### GET `/products` — Return All Products

- `async` on the handler means we can use `await` inside.
- `try / catch` handles errors: `try` runs the DB code; `catch` catches any failure and sends a `500` (Internal Server Error) response.
- `Product.find()` returns **all** documents as Mongoose document instances.
- `let products` (not `const`) is used because we immediately reassign it via `.map()` to build the `src` data URL for each product's picture.
- Inside `.map()`, if a product has `picture.data`, a `src` string is built: `` `data:${picture.filetype};base64,${picture.data}` `` — this is the format a browser `<img src>` tag needs to display an image stored as base64.
- `res.json(products)` converts the array to JSON and sends it back to the requester (e.g. React's axios).

---

### GET `/product/search_id/:id` — Return One Product

- `:id` is a URL parameter — a placeholder the front-end fills in. Express makes it available as `req.params.id`.
- `Product.findById(id)` searches MongoDB for a document whose `_id` matches. Returns `null` if nothing is found.
- `if (!product)` — the `!` means "if NOT" — runs when the product is `null`. Returns a `404` ("Not Found").
- After the null check, if the product has both `picture.data` and `picture.filetype`, a `src` string is built the same way as in `GET /products` so the front-end can display the image.
- `console.log(product)` prints the full product to the terminal before sending, useful for debugging.

---

### POST `/products/add` — Add a New Product

- `upload.single("picture")` is multer middleware that reads one uploaded file from the `picture` field and attaches it to `req.file`.
- `req.body` contains the text fields (`name`, `price`, `description`). Destructuring pulls each field into its own variable.
- `req.file` contains the uploaded image with these properties:
  - `originalname` — original filename
  - `mimetype` — file type (e.g. `image/jpeg`)
  - `size` — file size in bytes
  - `buffer` — raw file data as a Buffer
- `new Product({...})` creates a new document **in memory** using the schema. It hasn't been saved yet — think of it as filling out a form.
- `parseFloat(price)` converts the price from a string (`"9.99"`) to a number (`9.99`) because form inputs always send text.
- `picture ? { ... } : null` — uses the picture data if a file was uploaded; otherwise stores `null`.
- `.save()` writes the document to the database and returns the saved version (including the generated `_id`).
- Status `201` means "Created" — more specific than `200 OK`. The saved product is sent back so the front-end immediately has its new `_id`.

---

### PUT `/products/edit/:id` — Edit an Existing Product

- `PUT` is the HTTP verb for replacing/updating existing data.
- Example URL: `PUT http://localhost:8080/products/edit/839201`
- `upload.single("picture")` is included as middleware so the route can optionally accept a new image file, the same way `POST /products/add` does. If no file is uploaded, `req.file` is `undefined`.
- `pictureUpdate` is built from `req.file` only if a file was actually uploaded; otherwise it is `null`.
- `updateFields` starts with the text fields (`name`, `price`, `description`). The picture is added to `updateFields` only if `pictureUpdate` is not `null` — this way a product's existing picture is left untouched when no new file is sent.
- `findByIdAndUpdate()` is a Mongoose shortcut that:
  1. Finds the document whose `_id` matches `req.params.id`
  2. Applies the new field values
  3. Returns the result
- `{ new: true }` — by default Mongoose returns the **old** document before the update. Setting `new: true` returns the **updated** document instead.
- If the `_id` is not found, `updated` is `null` and a `404` is returned.

---

### DELETE `/products/delete/:id` — Remove a Product

- `DELETE` is the HTTP verb for removing data.
- Example URL: `DELETE http://localhost:8080/products/delete/839201`
- `findByIdAndDelete()` finds the document by `_id`, permanently removes it from the database, and returns the deleted document.
- The deleted product is sent back so the front-end can remove it from local state without re-fetching the whole list.

---

## Starting the Server

`app.listen(port, callback)` tells Express to start listening for incoming requests on the given port. Once ready, it calls `onHttpStart()` which prints a confirmation message to the terminal.

**To run the server:**
1. Type `node index.js` (or `npm test` to use nodemon)
2. Visit `http://localhost:8080/products` in your browser
3. Check your terminal — you'll see the products array printed there

---

## Changelog

### May 23, 2026

Three bugs fixed in `GET /products`:

| # | What was wrong | Fix |
|---|---|---|
| 1 | `const products` could not be reassigned by `.map()` — crashed every request with `TypeError: Assignment to constant variable` | Changed to `let products` |
| 2 | `Product.find()` returned Mongoose documents which strip non-schema fields on serialization — the `src` property was silently removed before the response was sent, so the frontend `<img>` had no `src` | Added `.lean()` so plain JS objects are returned and `src` survives `res.json()` *(later removed — see June 1)* |
| 3 | `console.log(p.picture.src[0])` ran outside the `if (p.picture?.data)` block — crashed on any product with no picture | Moved inside the `if` block |

### June 1, 2026

- Removed `.lean()` from `GET /products`. The route now returns Mongoose document instances directly. The `src` property added inside `.map()` still works because Mongoose includes it when serialising with `res.json()`.
- Removed the `console.log` inside `.map()` in `GET /products` — no longer needed.
- Updated `GET /product/search_id/:id` to also build a picture `src` string before returning, and added a `console.log(product)` for debugging.
- Updated `PUT /products/edit/:id` to accept an optional picture upload via `upload.single("picture")`. The picture field is only overwritten when a new file is actually sent.
