import { useDispatch, useSelector } from "react-redux";

import type { AppState } from "./types.ts";
import "./App.css";

function selectUser(s: AppState, props: { id: string }) {
  return s.users[props.id];
}

function App({ id }: { id: string }) {
  const dispatch = useDispatch();
  const user = useSelector((s: AppState) => selectUser(s, { id }));
  return (
    <div>
      <div>hi there, {user.name}</div>
      <button
        onClick={() => dispatch({ type: "fetch-user", payload: { id: "1" } })}
      >
        Fetch user
      </button>
      <button onClick={() => dispatch({ type: "fetch-mailboxes" })}>
        Fetch mailboxes
      </button>
    </div>
  );
}

export default App;
