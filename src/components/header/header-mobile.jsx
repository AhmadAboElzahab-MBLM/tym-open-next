import React from 'react';
import Link from 'next/link';
import Icons from '../layout/icons';
import BoxedContainer from '../layout/boxed-container';

export default function HeaderMobile({ position, handleClick, isOpen, isHome, homePath, lang }) {
  const getLogo = () => {
    if (isOpen) return 'TymSmallLogoRed';
    if (position <= 30) return isHome ? 'TymDefaultLogo' : 'TymSmallLogoRed';
    return 'TymSmallLogoRed';
  };

  return (
    <div
      data-open={isOpen}
      className="flex items-center p-4 data-[open=true]:h-20 md:p-7 lg:hidden">
      <BoxedContainer className="!px-0">
        <div className="flex h-full items-start justify-between gap-x-[20px]">
          <Link href={homePath || '#'} className='header-mobile-logo'>
            <Icons name={getLogo()} className="w-[180px]" />
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href={`/${lang}/search`}
              className={`h-fit
              ${(() => {
                if (isOpen)
                  return 'svg-child-circle:!stroke-primary svg-child-path:!stroke-primary';
                if (position <= 30)
                  return isHome
                    ? 'svg-child-circle:!stroke-white svg-child-path:!stroke-white'
                    : 'svg-child-circle:!stroke-primary svg-child-path:!stroke-primary';
                return 'svg-child-circle:!stroke-primary svg-child-path:!stroke-primary';
              })()}
              `}>
              <Icons name="Search" />
            </Link>
            <button
              type="button"
              onClick={handleClick}
              className={`h-fit
              ${(() => {
                if (isOpen) return 'svg-child-path:!stroke-primary';
                if (position <= 30)
                  return isHome ? 'svg-child-path:!stroke-white' : 'svg-child-path:!stroke-primary';
                return 'svg-child-path:!stroke-primary';
              })()}
              `}>
              <Icons name={`${isOpen ? 'Close' : 'Menu'}`} />
            </button>
          </div>
        </div>
      </BoxedContainer>
    </div>
  );
}
