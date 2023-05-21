import { useDispatch, useSelector } from "react-redux";

import "./App.css";
import { fetchUsers } from "./api.ts";
import type { AppState } from "./types.ts";

function selectUser(s: AppState, props: { id: string }) {
  return s.users[props.id];
}

function App({ id }: { id: string }) {
  const dispatch = useDispatch();
  const user = useSelector((s: AppState) => selectUser(s, { id }));
  return (
    <div>
      <div>hi there, {user.name}</div>
      <button onClick={() => dispatch(fetchUsers())}>Fetch users</button>
    </div>
  );
}

export default App;
