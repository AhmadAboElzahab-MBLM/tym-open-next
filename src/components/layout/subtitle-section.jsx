import React from 'react';

export default function SubtitleSection({ data, className = '' }) {
  return (
    <h3 className={`font-noto text-[12px] font-bold uppercase md:mb-1 md:text-[15px] ${className}`}>
      {data}
    </h3>
  );
}
