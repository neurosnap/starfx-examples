import ReactDOM from "react-dom/client";
import { createApi, mdw, timer } from "starfx";
import { configureStore, createSchema, slice, storeMdw } from "starfx/store";
import { Provider, useCache } from "starfx/react";

const [schema, initialState] = createSchema({
  loaders: slice.loader(),
  cache: slice.table(),
});

const api = createApi();
api.use(mdw.api());
api.use(storeMdw.store(schema));
api.use(api.routes());
api.use(mdw.fetch({ baseUrl: "https://jsonplaceholder.typicode.com" }));

const fetchUsers = api.get<never, {id: string, name: string}[]>(
  "/users",
  { supervisor: timer() },
  api.cache(),
);

const store = configureStore({ initialState });
// type WebState = typeof initialState;

store.run(api.bootup);

function App() {
  const { isLoading, data: users } = useCache(fetchUsers());

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      {users?.map(
        (user) => <div key={user.id}>{user.name}</div>,
      )}
    </div>
  );
}

const root = document.getElementById("root") as HTMLElement;
ReactDOM.createRoot(root).render(
  <Provider schema={schema} store={store}>
    <App />
  </Provider>,
);
