/**
 * Suppress the warning when using useLayoutEffect with SSR. (https://reactjs.org/link/uselayouteffect-ssr)
 * Make use of useInsertionEffect if available.
 */

const useInsertionEffect = typeof window !== 'undefined'
// useInsertionEffect is available in React 18+
// @ts-ignore
  ?  (React.useInsertionEffect || React.useLayoutEffect)
  : () => {};

export {
  useInsertionEffect
};
