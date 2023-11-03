import { SetStateAction } from 'react';
/**
 * Similar to useState, with a few subtle differences:
 * - The returned function is a promise that will resolve when FC is recalled and the state is same with the update value;
 */
declare function useStateWithPromise<S>(initialState: S | (() => S)): [
    S,
    (stateAction: SetStateAction<S>) => Promise<S>
];
export default useStateWithPromise;
