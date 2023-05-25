import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';

function useTextNode(text: React.ReactNode) {
  const ref = useRef<{
    text: React.ReactNode,
    setText?:(text: React.ReactNode) => void,
      }
      >(({
        text: null
      }));
  ref.current.text = text;

  const Text: any = useCallback(
    () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [text, setText] = useState(ref.current.text);
      ref.current.setText = setText;
      return text;
    },
    [],
  );

  useEffect(() => {
    if (ref.current.setText) ref.current.setText(text);
  }, [text]);

  return React.createElement<{}>(Text, {});
}

export default useTextNode;
