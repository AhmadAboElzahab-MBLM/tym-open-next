import { useCallback, useContext, useEffect } from 'react';
import { isFunction, set, forEach } from 'lodash';
import GlobalContext from '@/context/global-context'; // Import Lodash

export default function useReturnCursor(callback) {
  const { lang } = useContext(GlobalContext);

  const cursorPaths = {
    en: 'https://tym-new.euwest01.umbraco.io/media/uw2ddhng/return-cursor.png',
    'en-ko': 'https://tym-new.euwest01.umbraco.io/media/uw2ddhng/return-cursor.png',
    'en-us': 'https://tym-new.euwest01.umbraco.io/media/uw2ddhng/return-cursor.png',
    ko: 'https://tym-new.euwest01.umbraco.io/media/5jzojplu/return-cursor-ko.png',
  };

  const handleCallback = useCallback(() => {
    if (isFunction(callback)) {
      callback();
    }
  }, []);

  useEffect(() => {
    const returnCursor = document.createElement('div');
    set(returnCursor, 'id', 'returnCursor');

    const styles = {
      background: `url(${cursorPaths[lang]}) no-repeat center center`,
      backgroundSize: 'cover',
      height: '96px',
      width: '96px',
      position: 'fixed',
      top: '-100px',
      left: '-100px',
      zIndex: '1000',
      pointerEvents: 'none',
      transform: 'translate(-25%, -10%)',
      transition: 'all 0.2s 0.1s ease-out',
      transitionProperty: 'boxShadow, background, border-radius, height, width',
    };
    forEach(styles, (value, key) => {
      set(returnCursor.style, key, value);
    });

    document.body.classList.add('return-cursor-on');
    document.body.appendChild(returnCursor);

    const isHovering = false;
    const isTextHover = false;
    const textTop = 0;
    const textBottom = 0;

    const handleMouseMove = (event) => {
      const curCursor = document.querySelector('#returnCursor');
      if (curCursor && curCursor.style) {
        if (!isHovering) curCursor.style.left = `${event.clientX}px`;
        if (!isTextHover) curCursor.style.top = `${event.clientY}px`;
        if (textTop && textBottom && (event.clientY < textTop || event.clientY > textBottom)) {
          curCursor.style.top = `${event.clientY}px`;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      returnCursor.remove();
      document.body.classList.remove('return-cursor-on');
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleCursor = useCallback((isEnabled) => {
    const returnCursor = document.querySelector('#returnCursor');
    if (returnCursor) {
      // Already null-safe
      if (isEnabled) {
        returnCursor.style.display = 'block';
        document.body.classList.add('return-cursor-on');
        window.addEventListener('click', handleCallback);
      } else {
        returnCursor.style.display = 'none';
        document.body.classList.remove('return-cursor-on');
        window.removeEventListener('click', handleCallback);
      }
    }
  }, []);

  return { toggleCursor };
}
