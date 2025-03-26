import { createRoot } from "react-dom/client";
import "./reset.css";
import "./style.css";

import { App, store } from "./app";
import { Provider } from "react-redux";

const root = document.getElementById("root");

if (!root) {
  throw new Error("root not found");
}

const container = createRoot(root);

container.render(
  <Provider store={store}>
    <App />
  </Provider>
);
