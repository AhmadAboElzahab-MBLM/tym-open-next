import { useCallback } from 'react';

function useScrollBottom() {
  return useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth', // Optional: for smooth scrolling
    });
  }, []);
}

export default useScrollBottom;
