import { createApi, mdw } from "starfx";
import { takeEvery, storeMdw, slice, createSchema } from 'starfx/store';

interface User {
  id: string;
  name: string;
}

const emptyUser: User = { id: "", name: "" };
export const schema = createSchema({
  users: slice.table({ empty: emptyUser }),
  cache: slice.table(),
  loaders: slice.loader(),
});
export type AppState = typeof schema.initialState;
export const db = schema.db;

export const api = createApi();
api.use(function*(ctx, next) {
  yield* next();
  console.log(`ctx [${ctx.name}]`, ctx);
});
api.use(mdw.api());
api.use(storeMdw(db));
api.use(api.routes());
api.use(mdw.fetch({ baseUrl: 'https://jsonplaceholder.typicode.com' }));

export const fetchUsers = api.get<never, User[]>(
  '/users',
  { supervisor: takeEvery },
  function*(ctx, next) {
    yield* next();

    if (!ctx.json.ok) {
      return;
    }

    const users = ctx.json.value.reduce<Record<string, User>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    yield* schema.update(db.users.add(users));
  },
);
