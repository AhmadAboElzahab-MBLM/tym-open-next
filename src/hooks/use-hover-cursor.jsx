import { useCallback, useContext, useEffect } from 'react';
import _ from 'lodash';
import GlobalContext from '@/context/global-context';

export default function useHoverCursor() {
  const { lang } = useContext(GlobalContext);

  const cursorPaths = {
    en: 'https://tym-new.euwest01.umbraco.io/media/loxlipr4/hover-cursor-logo.png',
    'en-ko': 'https://tym-new.euwest01.umbraco.io/media/loxlipr4/hover-cursor-logo.png',
    'en-us': 'https://tym-new.euwest01.umbraco.io/media/loxlipr4/hover-cursor-logo.png',
    ko: 'https://tym-new.euwest01.umbraco.io/media/loxlipr4/hover-cursor-logo.png',
  };

  useEffect(() => {
    const hoverCursor = document.createElement('div');
    hoverCursor.setAttribute('id', 'hoverCursor');

    const defaultStyles = {
      background: `url(${cursorPaths[lang]}) no-repeat center center`,
      backgroundSize: 'cover',
      height: '48px',
      width: '48px',
      position: 'fixed',
      top: '-100px',
      left: '-100px',
      zIndex: '1000',
      pointerEvents: 'none',
      transform: 'translate(-25%, -10%)',
      transition: 'all 0.2s 0.1s ease-out',
      transitionProperty: 'boxShadow, background, border-radius, height, width',
    };
    _.forEach(defaultStyles, (value, key) => _.set(hoverCursor.style, key, value));

    document.body.classList.add('hover-cursor-on');
    document.body.appendChild(hoverCursor);

    const isHovering = false;
    const isTextHover = false;
    const textTop = 0;
    const textBottom = 0;

    const handleMouseMove = (event) => {
      const currCursor = document.querySelector('#hoverCursor');
      if (currCursor && currCursor.style) {
        if (!isHovering) currCursor.style.left = `${event.clientX}px`;
        if (!isTextHover) currCursor.style.top = `${event.clientY}px`;
        if (textTop && textBottom && (event.clientY < textTop || event.clientY > textBottom)) {
          currCursor.style.top = `${event.clientY}px`;
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      hoverCursor.remove();
      document.body.classList.remove('hover-cursor-on');
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleCursor = useCallback((isEnabled) => {
    const hoverCursor = document.querySelector('#hoverCursor');

    if (hoverCursor) {
      if (isEnabled && window.innerWidth >= 1024) {
        _.set(hoverCursor.style, 'display', 'block');
        document.body.classList.add('hover-cursor-on');
      } else {
        _.set(hoverCursor.style, 'display', 'none');
        document.body.classList.remove('hover-cursor-on');
      }
    }
  }, []);

  return { toggleCursor };
}
