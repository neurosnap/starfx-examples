import { call, select, updateStore } from 'starfx';
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
 
  const action = x;
  console.log('action', action)
  
  // console.log('action', action)
  // const payload = x[0]!.args![0];
  // console.log('payload', payload)

  // yield* call(()=>action(payload));

  const s = yield* select((s:AppState)=>s);

  console.log('s', s)
  console.log('s', s.getMap("users").toJSON());
  // const users = s.getMap("users");
  // console.log('users', users)
  
  // const nextUser =
  // users.set() 
  

  // console.log("doStuff", x);
}

function createSchema<D extends Y.Doc>(genDoc: (d: Y.Doc) => any): [any, D] {
  const ydoc = new Y.Doc();
  const doc = genDoc(ydoc);
  const db = {
    root: doc,
    users: doc.getMap("users"),
    *update(ups:any) {
      console.log('ups', ups)
      return yield* doStuff(ups);
    },
  };

  return [db, doc];
}
