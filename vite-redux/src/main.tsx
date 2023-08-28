import React from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from '@reduxjs/toolkit';

import { parallel, createQueryState } from "starfx";
import { prepareStore, take } from "starfx/redux";
import { Provider } from 'starfx/react';

import { api, userReducer } from "./api.ts";
import App from "./App.tsx";
import "./index.css";
import type { AppState } from "./types.ts";

init().then(console.log).catch(console.error);

async function init() {
  const initialState: AppState = {
    users: { 1: { id: "1", name: "eric" } },
    ...createQueryState(),
  };
  const { fx, reducer } = prepareStore({
    reducers: {
      users: userReducer as any,
    }
  });
  const store = configureStore({
    preloadedState: initialState,
    reducer,
    // reduxjs/toolkit is in flux with its middleware types
    middleware: (mdw) => mdw().concat(fx.middleware as any),
  });
  (window as any).reduxStore = store;

  fx.run(function* (): any {
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
