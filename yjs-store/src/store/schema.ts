import * as Y from 'yjs';

interface User {
  id: string;
  name: string;
}

export const [schema, initialState] = createSchema((ydoc) => {
  ydoc.getMap("users").set("boopK", "boopV");
  return ydoc;
});
export type AppState = typeof initialState;


function* doStuff(x:any){
  // we can bring in the schema operations here
 void 0;
}

function createSchema<D extends Y.Doc>(genDoc: (d: Y.Doc) => any): [any, D] {
  const ydoc = new Y.Doc();
  const doc = genDoc(ydoc);
  const db = {
    root: doc,
    users: doc.getMap("users"),
    *update(ups:any) {
      return yield* doStuff(ups);
    },
  };

  return [db, doc];
}
