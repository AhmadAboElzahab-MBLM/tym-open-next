import React from 'react';
import Arrow from '../../assets/svg/arrow.svg';

export default function ModalNavigationArrows({ onPrevious, onNext, hasPrevious, hasNext }) {
  return (
    <>
      <button
        type="button"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="absolute left-5 top-1/2 z-[15] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous image">
        <Arrow />
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className="absolute right-5 top-1/2 z-[15] transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next image">
        <Arrow className="rotate-180 text-white" />
      </button>
    </>
  );
}
