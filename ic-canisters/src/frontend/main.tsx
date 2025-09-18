import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App";
import "./src/index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error("❌ #root not found in index.html");
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
