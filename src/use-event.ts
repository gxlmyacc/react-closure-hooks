/* eslint-disable camelcase */
import React from 'react';
import { useInsertionEffect } from './utils';

type AnyFunction = (...args: any[]) => any;

/**
 * Similar to useCallback, with a few subtle differences:
 * - The returned function is a stable reference, and will always be the same between renders
 * - No dependency lists required
 * - Properties or state accessed within the callback will always be "current"
 */
export function useEvent<TCallback extends AnyFunction>(callback: TCallback): TCallback {
  // Keep track of the latest callback:
  const latestRef = React.useRef<TCallback>(callback);

  useInsertionEffect(() => {
    latestRef.current = callback;
  }, [callback]);

  // Create a stable callback that always calls the latest callback:
  // using useRef instead of useCallback avoids creating and empty array on every render
  const stableRef = React.useRef<TCallback>(null as any);
  if (!stableRef.current) {
    stableRef.current = function (this: any) {
      return latestRef.current.apply(this, arguments as any);
    } as TCallback;
  }

  return stableRef.current;
}


export default useEvent;
