import React from 'react';
import Icons from '@/components/layout/icons';

function Search({ label, placeholder, onSearchChange }) {
  const handleSearchChange = (event) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="flex w-full gap-x-4 border-b border-cherry">
      <span className="font-noto text-clamp12to15 font-bold uppercase">{`${label}:`}</span>
      <div className="relative w-full max-w-[22rem]">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full border-b-4 border-primary pb-3 font-noto text-clamp14to15
          placeholder:text-primary"
          onChange={handleSearchChange}
        />
        <Icons name="Search" className="absolute right-0 top-0 stroke-primary stroke-2" />
      </div>
    </div>
  );
}

export default Search;
