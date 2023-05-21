import { createApi, fetcher, requestMonitor } from "starfx/query";

export const api = createApi();
api.use(requestMonitor());
api.use(api.routes());
api.use(fetcher({ baseUrl: 'https://jsonplaceholder.typicode.com' }));

export const fetchUsers = api.get('/users', function*(ctx, next) {
  yield* next();
  if (!ctx.json.ok) {
    console.log(ctx);
    console.log(ctx.json.data);
    return;
  }

  console.log(ctx.json.data);
});
