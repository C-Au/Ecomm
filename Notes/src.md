# src/ — Notes

## App.jsx

The root component and router of the application. Every React app has one root component at the top of the component tree. `App.jsx`'s job is to:
1. Render the persistent navbar that appears on every page
2. Use React Router to show the correct page based on the URL

### Imports (react-router-dom)

- `Routes` — a container that looks at the current URL and renders the first `<Route>` whose path matches.
- `Route` — pairs a URL path with a component to show.
- `Link` — a navigation element that changes the URL without refreshing the whole page (faster than `<a href>`).

### JSX Notes

- `className="app-wrapper"` links to a CSS class in `App.css`. In React we use `className` instead of `class` because `class` is a reserved word in JavaScript.
- `<Link to="/manage">` is the React Router equivalent of `<a href="/manage">`. Using `Link` prevents a full page reload — React swaps in the new page instantly without a network round-trip.
- Routes:
  - `path="/"` → `<Home />`
  - `path="/product/:id"` → `<SingleProductPage />`; `:id` is a wildcard available inside the component via `useParams()`
  - `path="/manage"` → `<ManageProducts />`
- `export default` at the bottom makes `App` available to `main.jsx` which imports it.

---

## main.jsx

The entry point of the entire React application. The very first file that runs when the browser loads the app. Its only job is to mount the React app onto `index.html`'s `<div id="root">`.

### Imports

- `StrictMode` — a development helper from React. Deliberately runs certain checks twice to catch common mistakes early. No effect in the final production build.
- `createRoot` — how modern React (v18+) attaches itself to the DOM. Replaces the older `ReactDOM.render()` from previous versions.
- `BrowserRouter` — enables React Router. Reads the URL in the address bar and decides which page to show. Must wrap the entire app so every component inside can use routing features like `<Link>` and `useParams`.

### How it works

`document.getElementById("root")` finds the `<div id="root">` in `index.html`. `createRoot()` tells React to take control of that div. `.render()` fills it with the `<App />` component — everything the user sees is rendered inside this single div.
