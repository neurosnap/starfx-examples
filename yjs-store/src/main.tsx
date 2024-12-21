import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore, take } from 'starfx';
import { Provider } from 'starfx/react';
import * as Y from 'yjs';

import App from './App.tsx';
import { thunks } from './store/foundation.ts';
import { initialState, schema } from './store/schema.ts';

init();

function init() {
  const yjsProduceNextState = <Y extends Y.Doc>(state: Y, upds: any[]) => {
    console.log("upds", upds);
    console.log("state", state);
    state.transact(() => {
      upds.forEach((upd) => {
        const { fn, args } = upd;
        console.log({ state });
        console.log("fn", fn);
        console.log("args", args);
        state.getMap("users").set(args[0], args[0]);
      });
    });

    console.log("state-beforer", state.toJSON());

    return { nextState: state, patches: {} };
  };
  const store = createStore({
    initialState: initialState,
  });
  // makes `fx` available in devtools
  (window as any).fx = store;

  store.run([
    function* logger() {
      while (true) {
        const action = yield* take("*");
        console.log("action", action);
      }
    },
    thunks.register,
  ]);

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <Provider schema={schema} store={store}>
        <App id="1" />
      </Provider>
    </React.StrictMode>
  );
}
