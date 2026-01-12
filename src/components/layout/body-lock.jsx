import React from 'react';
import useHideOverflow from '@/hooks/use-hide-overflow';

function BodyLock() {
  useHideOverflow();
  return <div className="-z-10 hidden" />;
}

export default BodyLock;
