import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  // Ensure that the App.js file is present

// Export the testBackendConnection function
export async function testBackendConnection() {
  try {
    const response = await fetch("http://localhost:5002/api/test");  // Ensure the URL is correct
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