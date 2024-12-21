import { useState } from 'react';
import { useY } from 'react-yjs';
import { useDispatch, useSelector } from 'starfx/react';

import './App.css';
import { schema } from './store/schema';
import { addUser, rawUsers } from './store/users';

function App({ id }: { id: string }) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  // const all = useSelector(rawUsers);

  //we have to subscribe to the yjs store.
  // we could useExternalStore to do this
  const all2 = useY(schema.users);
  
  

  return (
    <div>
      <div className="input-container">
        <label htmlFor="addUser" className="input-label">
          Add User
        </label>
        <input
          id="addUser"
          type="text"
          aria-label="Update text input"
          placeholder="Enter username"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="text-input"
        />
        <button
          type="button"
          onClick={() =>{dispatch(addUser(text))}}
          // className="submit-button"
        >
          Submit
        </button>
      </div>
      <pre>{JSON.stringify(all2)}</pre>
      
      
      {/* <pre>{JSON.stringify(all, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(all2, null, 2)}</pre> */}
      {/* <div>hi there, {user.name}</div> */}
      {/* <button onClick={() => dispatch(fetchUsers())}>Fetch users</button>
      {userList.map((u) => {
        return <div key={u.id}>({u.id}) {u.name}</div>;
      })} */}
    </div>
  );
}

export default App;
