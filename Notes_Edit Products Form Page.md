
## Plan: Edit Products Form Page

**TL;DR:** Add a pre-populated edit form page that loads an existing product by ID, allows field edits, and PUTs changes back to the backend. Requires a new backend PUT endpoint, a new frontend page, and a new route.

---

### Phase 1 — Backend

1. Add `PUT /product/:id` to index.js
   - Find product in the in-memory array by `productId`
   - Merge updated `name`, `price`, `description`, `picture` fields onto the found object
   - Return the updated product as JSON, or 404 if not found

### Phase 2 — Frontend Page

2. Create `FrontEnd/pages/EditProductPage/EditProductPage.jsx` + `EditProductPage.css`
   - `useParams()` to get `:id` from URL
   - On mount: `axios.get(".../product/search_id/:id")` to pre-fill form fields
   - Controlled form state for: `name`, `price`, `description`, `picture`
   - On submit: `axios.put(".../product/:id", { ...fields })`
   - On success: `useNavigate()` back to `/product/:id`
   - Loading, error, and success feedback states
   - Styled to match the existing dark theme (`#161d30` bg, `#e94560` accent)

### Phase 3 — Routing & Navigation

3. Add route in App.jsx: `/product/:id/edit` → `<EditProductPage />`
4. Add an "Edit" button/link on SingleProductPage.jsx that navigates to `/product/:id/edit`

---

### Relevant Files

| File | Change |
|---|---|
| index.js | Add `PUT /product/:id` endpoint |
| App.jsx | Add new route |
| SingleProductPage.jsx | Add Edit link |
| `FrontEnd/pages/EditProductPage/EditProductPage.jsx` | **NEW** — form page |
| `FrontEnd/pages/EditProductPage/EditProductPage.css` | **NEW** — matching styles |

---

### Verification

1. Start backend and confirm `PUT /product/:id` returns 200 with updated data
2. Navigate to `/product/:id/edit` — confirm form pre-fills with existing product data
3. Edit a field and submit — confirm redirect to `/product/:id` showing updated values
4. Test with an invalid ID — confirm 404 error is shown gracefully in UI

---

### Decisions & Scope

- **In-memory data only** — edits don't persist past server restart (no DB yet)
- **No image upload** — `picture` is a plain-text filename string, kept as a text input
- **No auth guard** — authentication is out of scope for this feature
- **Styling** follows the existing dark theme across all existing pages


-------------------------------------------------------------------

29-Apr-2026

Add a mongo DB database to this project. Look at the previous project for guidance.

---------------------------------------------------------------------

09-May-2026

Move all notes outside of code file into a seperate MD file

Debug this file