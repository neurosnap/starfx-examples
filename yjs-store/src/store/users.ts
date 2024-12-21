import { createSelectorCreator } from 'reselect';
import { call, createSelector, select } from 'starfx';
import * as Y from 'yjs';

import { thunks } from './foundation.ts';
import { AppState, schema } from './schema.ts';

/**
 * Wraps a Y.js `Y.Map` with a reselect selector.
 *
 * @param yMap - The Y.js map to observe
 * @param mapFn - A function that derives state from the Y.Map
 * @returns A reselect selector that updates when the Y.Map changes
 */
function createYSelector<T, R>(yMap: Y.Map<T>, mapFn: (state: Record<string, T>) => R) {
  // Create a wrapper to observe changes
  let stateSnapshot = yMap.toJSON(); // Initial state snapshot
  let listeners = new Set<() => void>();

  // Listen for updates on the Y.Map
  yMap.observe(() => {
    stateSnapshot = yMap.toJSON(); // Update snapshot
    // Notify all listeners
    listeners.forEach((listener) => listener());
  });

  // Create a reselect selector
  const selector: any = createSelector(
    () => stateSnapshot, // Input selector
    mapFn              // Output selector (transform function)
  );

  // Add subscription functionality
  selector.subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener); // Return an unsubscribe function
  };

  return selector;
}

export const addUser = thunks.create<string>(
  "user:add", 
  function* (ctx, next) {
  
  yield*  call(schema.users.set('boopK', ctx.payload)); 
  yield* next();
});

// create a "selector creator" that uses lodash.isequal instead of ===
const createDeepEqualSelector = createSelectorCreator(
  lruMemoize,
  (boop:any) => true
);

const getUsers = (s:AppState) =>  s.getMap("users").toJSON();
export const rawUsers__ = createDeepEqualSelector(
  getUsers,
  (users) => {
    console.log('users', users)
    return users;
  }
);


export const rawUsers_ = createSelector(
  [(state) => state.toJSON()],
  (usersJSON) => {
    console.log({ usersJSON });
    const u = Object.keys(usersJSON).map((k) => {
      return { id: k, name: usersJSON[k] };
    });
    return u;
  }
);


export const rawUsers = createYSelector(schema.users, (users) => {
  console.log('users', users)
  return users;
});


export function lruMemoize(func:any, equalityCheckOrOptions:any) {
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
