import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import UIContextProvider from "./context/ui-context";
import FlightContextProvider from "./context/flight-context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <UIContextProvider>
      <FlightContextProvider>
        <App />
      </FlightContextProvider>
    </UIContextProvider>
  </React.StrictMode>
);
