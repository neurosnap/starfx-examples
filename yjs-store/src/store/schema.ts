import * as Y from "yjs";
import { updateStore } from "starfx";

interface User {
  id: string;
  name: string;
}

export const [schema, initialState] = createSchema((ydoc) => {
  ydoc.getMap("users").set("boopP", "boopV");

  return ydoc;
});
export type AppState = typeof initialState;

function createSchema<D extends Y.Doc>(genDoc: (d: Y.Doc) => any): [any, D] {
  const ydoc = new Y.Doc();
  const doc = genDoc(ydoc);
  const db = {
    root: doc,
    *update(ups) {
      return yield* updateStore(ups);
    },
  };

  return [db, doc];
}
