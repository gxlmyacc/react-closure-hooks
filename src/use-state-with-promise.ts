import {
  SetStateAction,
  useLayoutEffect,
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
  seed: number,
  proms: RefsStateProm<any>[],
};


function refsInitialState(): RefsState {
  return {
    seed: 0,
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

  useLayoutEffect(() => {
    if (!$refs.proms.length) return;
    const proms = $refs.proms.splice(0, $refs.proms.length);
    proms.forEach(prom => ((prom.options.alwaysResolve || prom.nextState === state) ? prom.resolve(state) : prom.reject(state)));
  }, [$refs, state, $refs.seed]);

  const setStateWithPromise = useEvent((stateAction: SetStateAction<S>, options: SetStateOptions = {}) => {
    let prom  = { options } as RefsStateProm<S>;
    const ret = new Promise((resolve, reject) => {
      prom.resolve = resolve;
      prom.reject = reject;
      $refs.proms.push(prom);
    }) as Promise<S>;

    if (typeof stateAction === 'function') {
      setState(prevState => {
        prom.nextState = (stateAction as any)(prevState) as S;
        if (prevState === prom.nextState) $refs.seed++;
        return prom.nextState;
      });
    } else {
      if (stateAction === state) $refs.seed++;
      setState(prom.nextState = stateAction as S);
    }
    return ret;
  });

  return [state, setStateWithPromise];
}

export default useStateWithPromise;
