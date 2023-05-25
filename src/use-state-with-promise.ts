import {
  SetStateAction,
  useState
} from 'react';
import useEvent from 'react-use-event-hook';
import { useBrowserEffect } from './utils';

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

  useBrowserEffect(() => {
    if (!$refs.proms.length) return;
    const proms = $refs.proms.splice(0, $refs.proms.length);
    proms.forEach(prom => ((prom.options.alwaysResolve || prom.nextState === state) ? prom.resolve(state) : prom.reject(state)));
  }, [$refs, state]);

  const setStateWithPromise = useEvent((stateAction: SetStateAction<S>, options: SetStateOptions = {}) => {
    let prom  = { options } as RefsStateProm<S>;
    const ret = new Promise((resolve, reject) => {
      prom.resolve = resolve;
      prom.reject = reject;
    }) as Promise<S>;

    if (typeof stateAction === 'function') {
      setState(prevState => {
        prom.nextState = (stateAction as any)(prevState) as S;
        if (prevState === prom.nextState) prom.resolve(prevState);
        else $refs.proms.push(prom);
        return prom.nextState;
      });
    } else {
      if (stateAction === state) prom.resolve(state);
      else {
        $refs.proms.push(prom);
        setState(prom.nextState = stateAction as S);
      }
    }
    return ret;
  });

  return [state, setStateWithPromise];
}

export default useStateWithPromise;
