import React from 'react';

function Search({ label, placeholder }) {
  return (
    <div className="flex w-full max-w-[46rem] gap-x-4 border-b border-grey pb-3 items-center z-[1000] relative">
      <span
        className="font-noto text-clamp12to15 font-bold uppercase tracking-[1.5px]
      after:inline after:content-[':'] inline-flex items-center h-[28px] md:h-[37px]">
        {label}
      </span>
      <input
        type="text"
        placeholder={placeholder}
        className="font-noto text-clamp12to15 placeholder:text-primary korean-font h-[28px] md:h-[37px]"
      />
    </div>
  );
}

export default Search;