import React from "react";
import ReactDOM from "react-dom/client";
import { parallel, take } from "starfx";
import { configureStore } from "starfx/store";
import { Provider } from 'starfx/react';
import { api, schema, initialState } from "./api.js";
import { App } from "./app.jsx";

init();

function init() {
  const store = configureStore({
    initialState,
    middleware: [
      function* logger(ctx, next) {
        yield* next();
        console.log("store updater", ctx);
      },
    ],
  });
  window.store = store;

  store.run(function* () {
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

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Provider schema={schema} store={store}>
        <App id="1" />
      </Provider>
    </React.StrictMode>
  );
}
