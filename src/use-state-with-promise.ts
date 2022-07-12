import {
  SetStateAction,
  useEffect,
  useState
} from 'react';
import useEvent from 'react-use-event-hook';

type SetStateOptions = {
  alwaysResolve?: boolean
}

type RefsStateProm<S> = {
  nextState: S,
  resolve: ((value: S | PromiseLike<S>) => void),
  reject: ((value: S | PromiseLike<S>) => void),
  options: SetStateOptions
};

type RefsState = {
  proms: RefsStateProm<any>[],
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
    proms.forEach(prom => ((prom.options.alwaysResolve || prom.nextState === state) ? prom.resolve(state) : prom.reject(state)));
  }, [$refs, state]);

  const setStateWithPromise = useEvent((stateAction: SetStateAction<S>, options: SetStateOptions = {}) => {
    let prom  = { options } as RefsStateProm<S>;
    if (typeof stateAction === 'function') {
      setState(prevState => {
        prom.nextState = (stateAction as any)(prevState) as S;
        return prom.nextState;
      });
    } else {
      setState(prom.nextState = stateAction as S);
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
