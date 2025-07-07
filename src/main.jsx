import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import router from "./router/root";
import { RouterProvider } from "react-router-dom";
import "./assets/styles/style.css";
import './index.css'
import {Provider} from "react-redux";
import store from "./store.jsx";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
  <RouterProvider router={router} />
    </Provider>
);
