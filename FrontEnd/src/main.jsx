// ============================================================
// main.jsx — The entry point of the entire React application
//
// This is the very first file that runs when the browser loads
// the app.  Its only job is to mount the React app onto the HTML
// page (index.html has a <div id="root"> that React takes over).
// ============================================================

// StrictMode is a development helper from React.
// It deliberately runs certain checks twice to help you catch
// common mistakes early.  It has no effect in the final build.
import { StrictMode } from "react";

// createRoot is how modern React (v18+) attaches itself to the DOM.
// It replaces the older ReactDOM.render() from previous versions.
import { createRoot } from "react-dom/client";

// BrowserRouter enables React Router — the library that reads the
// URL in the address bar and decides which page to show.
// It must wrap the entire app so every component inside can use
// routing features like <Link> and useParams.
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

// document.getElementById("root") finds the <div id="root"> in
// index.html.  createRoot() tells React to take control of that
// div.  .render() fills it with our App component.
//
// Everything the user sees is rendered inside this single div.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* BrowserRouter wraps App so that all pages and components
        inside it can use React Router's navigation tools. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
