import { useDispatch, useSelector } from "starfx/react";

import "./App.css";
import { fetchUsers, selectUser, selectUserList } from "./api.ts";
import type { AppState } from "./types.ts";

function App({ id }: { id: string }) {
  const dispatch = useDispatch();
  const user = useSelector((s: AppState) => selectUser(s, { id }));
  const userList = useSelector(selectUserList);
  return (
    <div>
      <div>hi there, {user.name}</div>
      <button onClick={() => dispatch(fetchUsers())}>Fetch users</button>
      {userList.map((u) => {
        return <div key={u.id}>({u.id}) {u.name}</div>
      })}
    </div>
  );
}

export default App;
