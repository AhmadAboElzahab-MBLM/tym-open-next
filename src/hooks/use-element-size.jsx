import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import _ from 'lodash';

export default function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleSize = () => {
    const width = _.get(ref, 'current.offsetWidth', 0);
    const height = _.get(ref, 'current.offsetHeight', 0);

    setSize({ width, height });
  };

  useEffect(() => {
    const handleResize = _.throttle(handleSize, 300);
    if (!_.isEmpty(ref.current)) window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    handleSize();
  }, [ref]);

  return [ref, size.width, size.height];
}
