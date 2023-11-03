import { useMemo, useRef } from 'react';

/**
 * Similar to useMemo, with a few subtle differences:
 * - The factory function has a argument which is the result of the previous call to the factory function
 */
function useMemoWithArgument<T>(
  factory: (arg?: T) => T,
  deps: React.DependencyList | undefined
) {
  const ref = useRef<T|undefined>(undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const result =  useMemo(() => factory(ref.current), deps);
  ref.current = result;

  return result;
}

export default useMemoWithArgument;
