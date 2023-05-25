import {
  useLayoutEffect,
  // @ts-ignore
  useInsertionEffect, // Only available in React 18+
} from 'react';

/**
 * Suppress the warning when using useLayoutEffect with SSR. (https://reactjs.org/link/uselayouteffect-ssr)
 * Make use of useInsertionEffect if available.
 */
const useBrowserEffect = typeof window !== 'undefined' ? useInsertionEffect ?? useLayoutEffect : () => {};

export {
  useBrowserEffect
};
