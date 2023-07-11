import { createApi, fetcher, requestMonitor } from "starfx/query";
import { createSelector, updateStore } from 'starfx/store';
import { AppState, User } from "./types";

export const api = createApi();
api.use(requestMonitor());
api.use(api.routes());
api.use(fetcher({ baseUrl: 'https://jsonplaceholder.typicode.com' }));

export function selectUserTable(s: AppState) {
  return s.users;
}

export const selectUserList = createSelector(selectUserTable, (userMap) => Object.values(userMap));

export function selectUser(s: AppState, props: { id: string }) {
  return selectUserTable(s)[props.id];
}

const addUsers = (umap: User[]) => (state: AppState) => {
  const users = selectUserTable(state);
  umap.forEach((u) => {
    users[u.id] = { ...users[u.id], id: u.id, name: u.name };
  });
}

export const fetchUsers = api.get<never, User[]>('/users', function*(ctx, next) {
  yield* next();
  if (!ctx.json.ok) {
    return;
  }
  yield* updateStore(addUsers(ctx.json.data));
});
