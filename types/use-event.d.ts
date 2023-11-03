declare type AnyFunction = (...args: any[]) => any;
/**
 * Similar to useCallback, with a few subtle differences:
 * - The returned function is a stable reference, and will always be the same between renders
 * - No dependency lists required
 * - Properties or state accessed within the callback will always be "current"
 */
export declare function useEvent<TCallback extends AnyFunction>(callback: TCallback): TCallback;
export default useEvent;
