import { SetStateAction } from 'react';
declare function useStateWithPromise<S>(initialState: S | (() => S)): [
    S,
    (stateAction: SetStateAction<S>) => Promise<S>
];
export default useStateWithPromise;
