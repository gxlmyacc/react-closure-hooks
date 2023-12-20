import { useMemo, useRef } from 'react';

/**
 * Similar to useMemo, with a few subtle differences:
 * - The factory function has a argument which is the result of the previous call to the factory function
 */
function useMemoWithArgument<T>(
  factory: (
    prevResult: T|undefined,
    prevDeps: React.DependencyList|undefined,
    extra: Record<string, any>,
  ) => T,
  deps: React.DependencyList | undefined
) {
  const ref = useRef<{
    result: T|undefined,
    deps: React.DependencyList|undefined,
    extra: Record<string, any>,
  }>({ result: undefined, deps: undefined, extra: {} });

  return useMemo(() => {
    const result = factory(ref.current.result, ref.current.deps, ref.current.extra);
    ref.current.result = result;
    ref.current.deps = deps;
    return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useMemoWithArgument;
