export interface User {
  id: string;
  name: string;
}

export interface AppState {
  users: { [key: string]: User };
}

export interface Action {
  type: string;
}
