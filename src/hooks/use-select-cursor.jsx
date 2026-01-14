import { useCallback, useContext, useEffect } from 'react';
import _ from 'lodash';
import GlobalContext from '@/context/global-context';

export default function useSelectCursor() {
  const { lang } = useContext(GlobalContext);

  const cursorPaths = {
    en: 'https://tym-new.euwest01.umbraco.io/media/liunqjx0/select-cursor.png',
    'en-ko': 'https://tym-new.euwest01.umbraco.io/media/liunqjx0/select-cursor.png',
    'en-us': 'https://tym-new.euwest01.umbraco.io/media/liunqjx0/select-cursor.png',
    ko: 'https://tym-new.euwest01.umbraco.io/media/jhdavedr/select-cursor-ko.png',
  };

  useEffect(() => {
    const selectCursor = document.createElement('div');
    selectCursor.setAttribute('id', 'selectCursor');

    const defaultStyles = {
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
    _.forEach(defaultStyles, (value, key) => _.set(selectCursor.style, key, value));

    document.body.classList.add('select-cursor-on');
    document.body.appendChild(selectCursor);

    const isHovering = false;
    const isTextHover = false;
    const textTop = 0;
    const textBottom = 0;

    const handleMouseMove = (event) => {
      const currCursor = document.querySelector('#selectCursor');
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
      selectCursor.remove();
      document.body.classList.remove('select-cursor-on');
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleCursor = useCallback((isEnabled) => {
    const selectCursor = document.querySelector('#selectCursor');

    if (selectCursor) {
      if (isEnabled && window.innerWidth >= 1024) {
        _.set(selectCursor.style, 'display', 'block');
        document.body.classList.add('select-cursor-on');
      } else {
        _.set(selectCursor.style, 'display', 'none');
        document.body.classList.remove('select-cursor-on');
      }
    }
  }, []);

  return { toggleCursor };
}
