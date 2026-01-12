import React from 'react';

export default function Toggles({ selected, setSelected, firstLabel, secondLabel, variant }) {
  return (
    <div className="flex h-fit flex-row-reverse gap-x-4">
      <button
        type="button"
        onClick={() => {
          setSelected(secondLabel);
        }}
        className={`${variant === 'compact' ? 'px-6 py-2 text-lg' : 'px-6 py-2 text-base lg:px-16 lg:py-4'} flex items-center justify-center transition-colors duration-400 ease-in-out ${
          selected !== secondLabel
            ? variant === 'compact'
              ? 'border-[1px] border-grey bg-white text-primary'
              : 'border-[1px] border-mercury bg-mercury text-primary'
            : 'border-[1px] border-JDGreen bg-JDGreen text-white'
        }`}>
        {secondLabel}
      </button>
      <button
        type="button"
        onClick={() => {
          setSelected(firstLabel);
        }}
        className={`${variant === 'compact' ? 'px-6 py-2 text-lg' : 'px-6 py-2 text-base lg:px-16 lg:py-4'} flex items-center justify-center transition-colors duration-400 ease-in-out ${
          selected !== firstLabel
            ? variant === 'compact'
              ? 'border-[1px] border-grey bg-white text-primary'
              : 'border-[1px] border-mercury bg-mercury text-primary'
            : 'border-[1px] border-JDGreen bg-JDGreen text-white'
        }`}>
        {firstLabel}
      </button>
    </div>
  );
}
