import type { QueryState } from "starfx/query";

export interface User {
  id: string;
  name: string;
}

export interface AppState extends QueryState {
  users: { [key: string]: User };
}

export interface Action {
  type: string;
}
