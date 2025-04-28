import { createApi, createSchema, mdw, resource, slice } from "starfx";
import { once } from "effection";

interface User {
  id: string;
  name: string;
}

const emptyUser: User = { id: "", name: "" };
export const [schema, initialState] = createSchema({
  users: slice.table({ empty: emptyUser }),
  cache: slice.table(),
  loaders: slice.loaders(),
});
export type AppState = typeof initialState;

function useWebSocket(url: string) {
  console.log(url);
  return resource(function* (provide) {
    let socket = new WebSocket(url);
    yield* once(socket, "open");

    try {
      yield* provide(socket);
    } finally {
      socket.close();
      yield* once(socket, "close");
    }
  });
}

export const api = createApi();
api.use(mdw.api({ schema }));
api.use(api.routes());
api.use(mdw.fetch({ baseUrl: "https://jsonplaceholder.typicode.com" }));
api.manage("wss", useWebSocket("wss://echo.websocket.org/"));

export const fetchUsers = api.get<never, User[]>(
  "/users",
  function* (ctx, next) {
    console.log(ctx);
    const socket = yield* ctx.resources.wss;
    socket.send("hello world");
    yield* next();

    if (!ctx.json.ok) {
      return;
    }

    const users = ctx.json.value.reduce<Record<string, User>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    yield* schema.update(schema.users.add(users));
  }
);
