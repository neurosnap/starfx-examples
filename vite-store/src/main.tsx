import React from "react";
import ReactDOM from "react-dom/client";

import { parallel } from "starfx";
import { configureStore, take } from "starfx/store";
import { Provider } from 'starfx/react';

import { api, schema } from "./api.ts";
import App from "./App.tsx";
import "./index.css";

init().then(console.log).catch(console.error);

async function init() {
  const store = configureStore({
    initialState: schema.initialState,
    middleware: [
      function* logger(ctx, next) {
        yield* next();
        console.log("store updater", ctx);
      },
    ],
  });
  (window as any).fx = store;

  store.run(function* (): any {
    const group = yield* parallel([
      function* logger() {
        while (true) {
          const action = yield* take("*");
          console.log("action", action);
        }
      },
      api.bootup,
    ]);
    yield* group;
  });

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <App id="1" />
      </Provider>
    </React.StrictMode>
  );
}
