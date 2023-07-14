import { createApi, fetcher, requestMonitor } from "starfx";
import { createSelector, put, ActionWPayload, takeEvery } from 'starfx/redux';
import { AppState, User } from "./types";

export const api = createApi();
api.use(requestMonitor());
api.use(api.routes());
api.use(fetcher({ baseUrl: 'https://jsonplaceholder.typicode.com' }));

export const userReducer = (state: AppState["users"] = {}, action: ActionWPayload<User[]>) => {
  if (action.type === "users/add") {
    const nextState = { ...state };
    action.payload.forEach((u) => {
      nextState[u.id] = { ...nextState[u.id], id: u.id, name: u.name };
    });
    return nextState;
  }

  return state;
}
const addUsers = (payload: User[]) => {
  return {
    type: "users/add",
    payload,
  };
}

export function selectUserTable(s: AppState) {
  return s.users;
}

export const selectUserList = createSelector(selectUserTable, (userMap) => Object.values(userMap));

export function selectUser(s: AppState, props: { id: string }) {
  return selectUserTable(s)[props.id];
}

export const fetchUsers = api.get<never, User[]>(
  '/users',
  { supervisor: takeEvery },
  function*(ctx, next) {
    yield* next();
    if (!ctx.json.ok) {
      return;
    }
    yield* put(addUsers(ctx.json.data));
  },
);
