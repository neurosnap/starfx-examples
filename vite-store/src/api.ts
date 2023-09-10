import { createApi, fetcher, requestMonitor } from "starfx";
import { takeEvery, storeMdw, slice, createSchema } from 'starfx/store';

interface User {
  id: string;
  name: string;
}

const emptyUser = { id: "", name: "" };
export const schema = createSchema({
  users: slice.table({ empty: emptyUser }),
  data: slice.table({ empty: {} }),
  loaders: slice.loader(),
});
export type AppState = typeof schema.initialState;
export const db = schema.db;

export const api = createApi();
api.use(requestMonitor());
api.use(storeMdw(db));
api.use(api.routes());
api.use(fetcher({ baseUrl: 'https://jsonplaceholder.typicode.com' }));

export const fetchUsers = api.get<never, User[]>(
  '/users',
  { supervisor: takeEvery },
  function*(ctx, next) {
    yield* next();
    if (!ctx.json.ok) {
      return;
    }

    const users = ctx.json.data.reduce<Record<string, User>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
    yield* schema.update(db.users.add(users));
  },
);
