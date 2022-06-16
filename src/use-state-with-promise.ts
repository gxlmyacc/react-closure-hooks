import {
  SetStateAction,
  useEffect,
  useState
} from 'react';
import useEvent from 'react-use-event-hook';

type RefsStateProm<S> = {
  nextState: S,
  resolve: ((value: S | PromiseLike<S>) => void),
  reject: ((value: S | PromiseLike<S>) => void),
};

type RefsState = {
  proms: RefsStateProm<any>[]
};

function refsInitialState(): RefsState {
  return {
    proms: []
  };
}

function useStateWithPromise<S>(
  initialState: S | (() => S)
): [
  S,
  (stateAction: SetStateAction<S>) => Promise<S>
] {
  const [state, setState] = useState(initialState);
  const [$refs] = useState(refsInitialState);

  useEffect(() => {
    if (!$refs.proms.length) return;
    const proms = $refs.proms.splice(0, $refs.proms.length);
    proms.forEach(prom => (prom.nextState === state ? prom.resolve(state) : prom.reject(state)));
  }, [$refs, state]);

  const setStateWithPromise = useEvent((stateAction: SetStateAction<S>) => {
    let prom  = {} as RefsStateProm<S>;
    if (typeof stateAction === 'function') {
      setState(prevState => {
        prom.nextState = (stateAction as any)(prevState) as S;
        return prom.nextState;
      });
    } else {
      prom.nextState = stateAction as S;
    }
    return new Promise((resolve, reject) => {
      prom.resolve = resolve;
      prom.reject = reject;
      $refs.proms.push(prom);
    }) as Promise<S>;
  });

  return [state, setStateWithPromise];
}

export default useStateWithPromise;
