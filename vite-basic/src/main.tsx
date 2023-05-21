import React from "react";
import ReactDOM from "react-dom/client";
import { go, sleep, keepAlive } from "starfx";
import { configureStore, take } from "starfx/redux";
import { Provider } from 'react-redux';

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

function* users() {
  while (true) {
    const action = yield* take("fetch-user");
    yield* go(function* () {
      console.log(action);
    });
  }
}
function* mailboxes() {
  while (true) {
    const action = yield* take("fetch-mailboxes");
    yield* go(function* () {
      console.log(action);
      yield* sleep(1000);
      throw new Error("wtf");
    });
  }
}

fx.run(() => keepAlive([users, mailboxes]));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App id="1" />
    </Provider>
  </React.StrictMode>
);
