import React from 'react';
import Arrow from '../../assets/svg/arrow.svg';
import Plus from '../../assets/svg/plus.svg';
import Minus from '../../assets/svg/minus.svg';
import FullScreen from '../../assets/svg/fullScreen.svg';

function ControlButton({ icon: Icon, onClick, disabled = false, flip = false, size = 'default' }) {
  const iconSizeClass = size === 'small' ? 'scale-75' : 'text-sm md:text-base';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${flip && 'rotate-180'} flex h-10 w-10 cursor-pointer items-center justify-center border-[1px] border-grey text-primary hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-grey disabled:hover:bg-transparent disabled:hover:text-primary md:h-12 md:w-12`}>
      <span className={iconSizeClass}>
        <Icon />
      </span>
    </button>
  );
}

export default function Controls({
  tridiRef,
  zoomOut,
  zoomIn,
  zoomLevel,
  isFullScreen,
  setFullScreen,
}) {
  return (
    <div className="flex flex-col justify-center gap-2 md:flex-row md:gap-4">
      <div className="flex items-center justify-center gap-2 md:hidden">
        <div className="flex gap-1">
          <ControlButton icon={Plus} onClick={zoomIn} disabled={zoomLevel >= 3} />
          <ControlButton icon={Minus} onClick={zoomOut} disabled={zoomLevel <= 1} />
        </div>

        <div className="mx-4 flex gap-1">
          <ControlButton icon={Arrow} size="small" onClick={() => tridiRef.current?.prev()} />
          <ControlButton icon={Arrow} size="small" flip onClick={() => tridiRef.current?.next()} />
        </div>

        <ControlButton
          icon={isFullScreen ? FullScreen : FullScreen}
          onClick={() => setFullScreen((prev) => !prev)}
        />
      </div>

      {/* Desktop Layout - Original Three Column Layout */}
      <div className="hidden w-full md:flex">
        <div className="flex w-1/3 flex-row items-center justify-start gap-x-4">
          <div className="flex gap-x-2">
            <ControlButton icon={Plus} onClick={zoomIn} disabled={zoomLevel >= 3} />
            <ControlButton icon={Minus} onClick={zoomOut} disabled={zoomLevel <= 1} />
            <div className="ml-4">
              <ControlButton icon={FullScreen} onClick={() => setFullScreen((prev) => !prev)} />
            </div>
          </div>
        </div>

        <div className="flex w-1/3 flex-row items-center justify-center gap-x-4">
          <ControlButton icon={Arrow} onClick={() => tridiRef.current?.prev()} />
          <ControlButton icon={Arrow} flip onClick={() => tridiRef.current?.next()} />
        </div>

        <div className="w-1/3" />
      </div>
    </div>
  );
}
