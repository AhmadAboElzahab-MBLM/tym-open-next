import React from 'react';
import Icons from './icons';

export default function SliderPrevNext({
  handleClickPrev,
  handleClickNext,
  imageSwiper,
  currentIndex,
  slideCount,
}) {
  return (
    <div className="flex flex-row items-center justify-center gap-x-[8px]">
      <button
        type="button"
        onClick={handleClickPrev}
        className={`z-10 ${
          imageSwiper && currentIndex === 0
            ? `pointer-events-none h-full w-[12px] cursor-default opacity-50
            svg-child-path:stroke-primary`
            : 'h-full w-[12px] opacity-100 svg-child-path:stroke-primary'
        } svg-child-path:stroke-[1.5px] md:svg-child-path:stroke-[2.5px] slider-prev-button`}>
        <Icons name="ArrowUp" className="" />
      </button>
      <button
        type="button"
        onClick={handleClickNext}
        className={`z-10 ${
          imageSwiper && currentIndex === slideCount - 1
            ? `pointer-events-none h-full w-[12px] cursor-default pt-[2px]
            opacity-50 svg-child-path:stroke-primary`
            : 'h-full w-[12px] pt-[2px] opacity-100 svg-child-path:stroke-primary'
        } svg-child-path:stroke-[1.5px] md:svg-child-path:stroke-[2.5px] slider-next-button`}>
        <Icons name="WhiteArrowDown" />
      </button>
    </div>
  );
}
