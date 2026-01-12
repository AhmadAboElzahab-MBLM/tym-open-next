import React from 'react';

export default function Tooltip({ children, label }) {
  return (
    <div className="group relative">
      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded-md bg-purple-950 px-1.5
        pb-0.5 pt-1 text-[0.675rem] text-white opacity-0 transition-all  duration-300
        group-hover:scale-100 group-hover:opacity-100">
        {label}
      </div>
      {children}
    </div>
  );
}
