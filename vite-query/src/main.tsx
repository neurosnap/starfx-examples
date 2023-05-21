import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { configureStore } from "starfx/redux";

import { api } from "./api.ts";
import App from "./App.tsx";
import "./index.css";
import type { AppState, Action } from "./types.ts";

const initUsers = {
  "1": { id: "1", name: "joe" },
};

const { store, fx } = configureStore({
  reducers: {
    users: (s: AppState["users"] = initUsers, _: Action) => s,
  },
});

fx.run(api.bootup);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App id="1" />
    </Provider>
  </React.StrictMode>
);
