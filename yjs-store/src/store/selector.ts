import { useSyncExternalStore } from 'react';
import * as Y from 'yjs';

function subscribeYMap(ymap: Y.Map<any>, callback: () => void): () => void {
	const handler = () => callback();
	ymap.observe(handler);
  
	// Return an unsubscribe function
	return () => {
	  ymap.unobserve(handler);
	};
  }
  

  // Define a state selector for Y.js map
function ymapSelector(ymap: Y.Map<any>) {
  return ymap.toJSON(); // Converts the Y.Map to a plain object
}

// Hook for syncing Y.js with React
export function useYjsStore(ymap: Y.Map<any>) {
  return useSyncExternalStore(
    (callback) => subscribeYMap(ymap, callback), // Subscription mechanism
    () => ymapSelector(ymap) // Selector to derive state
  );
}
