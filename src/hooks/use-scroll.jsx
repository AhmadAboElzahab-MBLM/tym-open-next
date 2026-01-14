import { useEffect, useState } from 'react';

function useScroll() {
  const windowGlobal = typeof window !== 'undefined' && window;
  const [position, setPosition] = useState(0);
  const [visible, setVisible] = useState(true);
  const handleScroll = () => {
    const moving = windowGlobal.window.scrollY <= 30 ? 0 : windowGlobal.window.scrollY;
    setVisible(position > moving || moving === 0);
    setPosition(moving);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return { position, visible };
}

export default useScroll;
