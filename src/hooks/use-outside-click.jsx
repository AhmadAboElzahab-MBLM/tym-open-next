import { useEffect } from 'react';

export default function useOutsideClick(ref, handler) {
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (!isBrowser) return null;
    const listener = (event) => {
      if (!ref?.current || ref?.current?.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
