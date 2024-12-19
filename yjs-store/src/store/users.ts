import { createSelector } from "starfx";
import { thunks } from "./foundation.ts";
import { schema } from "./schema.ts";

export const addUser = thunks.create<string>("user:add", function* (ctx, next) {
  const user = ctx.payload;
  console.log({ schema });
  yield* schema.update([{ fn: schema.root.getMap("users").set, args: [user] }]);
  console.log("user", user);
  yield* next();
});

import { createSelectorCreator } from "reselect";

// create a "selector creator" that uses lodash.isequal instead of ===
const createDeepEqualSelector = createSelectorCreator(
  lruMemoize,
  (boop) => true
);

export const rawUsers = createDeepEqualSelector(
  [(state) => state.toJSON()],
  (usersJSON) => {
    console.log({ usersJSON });
    const u = Object.keys(usersJSON).map((k) => {
      return { id: k, name: usersJSON[k] };
    });
    return u;
  }
);

export function lruMemoize(func, equalityCheckOrOptions) {
  let resultsCount = 0;

  function memoized() {
    return arguments;
  }

  memoized.clearCache = () => {
    memoized.resetResultsCount();
  };

  memoized.resultsCount = () => resultsCount;

  memoized.resetResultsCount = () => {
    resultsCount = 0;
  };

  return memoized;
}
