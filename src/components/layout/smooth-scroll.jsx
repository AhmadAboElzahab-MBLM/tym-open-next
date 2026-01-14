import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis
      options={{
        wheelMultiplier: 1.2,
        lerp: 0.08,
      }}
      root>
      {children}
    </ReactLenis>
  );
}
