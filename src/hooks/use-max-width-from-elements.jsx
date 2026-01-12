import { useState, useEffect, useRef, useCallback } from 'react';

export default function useMaxWidthFromElements() {
  const [maxWidth, setMaxWidth] = useState(0);
  const elementRefs = useRef([]);

  const setRefs = useCallback((el) => {
    if (el && !elementRefs.current.includes(el)) {
      elementRefs.current.push(el);
    }
  }, []);

  useEffect(() => {
    const widths = elementRefs.current.map((element) => element.getBoundingClientRect().width);
    setMaxWidth(Math.max(...widths));
  }, []);

  return [maxWidth, setRefs];
}
