import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";  // Ensure that the App.js file is present

// Export the testBackendConnection function
export async function testBackendConnection() {
  try {
    const response = await fetch("/api/test");
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: true };
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);