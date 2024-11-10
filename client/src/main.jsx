import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@rainbow-me/rainbowkit/styles.css";
import {Toaster} from 'react-hot-toast'

import Provider from "./components/Provider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
    <Toaster/>
      <App />
    </Provider>
  </StrictMode>
);
