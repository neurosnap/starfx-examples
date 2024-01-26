import { initialState as schemaInitialState, api } from "./api";
import { LogContext, each, log, parallel, take } from "starfx";
import { configureStore } from "starfx/store";

export function setupStore({ initialState = {} }) {
  const store = configureStore({
    initialState: {
      ...schemaInitialState,
      ...initialState,
    },
  });

  store.run(api.bootup);

  return store;
}
