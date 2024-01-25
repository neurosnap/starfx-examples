import { initialState as schemaInitialState } from "./api";
import { LogContext, each, log, parallel, take } from "starfx";
import { configureStore } from "starfx/store";

export function setupStore({ initialState = {} }) {
  const store = configureStore({
    initialState: {
      ...schemaInitialState,
      ...initialState,
    },
  });

  const tsks = [];

  store.run(function* () {
    const group = yield* parallel(tsks);
    yield* group;
  });

  return store;
}
