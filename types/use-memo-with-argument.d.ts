/// <reference types="react" />
/**
 * Similar to useMemo, with a few subtle differences:
 * - The factory function has a argument which is the result of the previous call to the factory function
 */
declare function useMemoWithArgument<T>(factory: (prevResult: T | undefined, prevDeps: React.DependencyList | undefined, extra: Record<string, any>) => T, deps: React.DependencyList | undefined): T;
export default useMemoWithArgument;
