/* eslint-disable max-len */

import React from 'react';
import Link from 'next/link';
import _ from 'lodash';
import Icons from './icons';

const variantClasses = {
  primaryText: `bg-transparent hover:text-primary hover:bg-transparent text-primary text-clamp14to15 leading-1.625 whitespace-pre font-noto font-bold !min-w-[auto] !min-h-[auto] !w-[auto] !h-[auto] flex flex-row gap-x-2 md:gap-x-4 justify-center items-center !px-0 !py-0`,
  primaryWhite: `bg-white hover:text-primary hover:!bg-mercury hover:!border hover:!border-b-white text-primary text-clamp14to15 uppercase leading-1.625 whitespace-pre font-bold border border-none`,
  primaryMercury: `bg-mercury hover:text-primary hover:!bg-white hover:!border hover:!border-b-mercury text-primary text-clamp14to15 uppercase leading-1.625 whitespace-pre font-bold border border-mercury`,
  primaryCherry: `bg-cherry hover:text-white hover:bg-paprika text-white text-clamp14to15 uppercase leading-1.625 whitespace-pre font-bold border-none`,
  primaryJD: `bg-JDGreen hover:text-white hover:bg-JDGreen/70 text-white text-clamp14to15 uppercase leading-1.625 whitespace-pre font-bold border-none`,
};

export default function Button(props) {
  const clickHandler = _.get(props, 'clickHandler', '');
  const label = _.get(props, 'label', '');
  const ariaLabel = _.get(props, 'ariaLabel', '');
  const w = _.get(props, 'w', '');
  const h = _.get(props, 'h', 'lg:min-h-[64px] min-h-[45px]');
  const px = _.get(props, 'px', 'px-[32px] md:px-[60px] lg:px-[85px]');
  const py = _.get(props, 'py', 'md:py-[20px] py-[12px]');
  const bg = _.get(props, 'bg', '');
  const z = _.get(props, 'z', '');
  const hover = _.get(props, 'hover', '');
  const text = _.get(props, 'text', '');
  const font = _.get(props, 'font', 'not-italic');
  const border = _.get(props, 'border', '');
  const rounded = _.get(props, 'rounded', '');
  const shadow = _.get(props, 'shadow', '');
  const url = _.get(props, 'url', '');
  const target = _.get(props, 'target', '_self');
  const leading = _.get(props, 'leading', '');
  const external = _.get(props, 'external', '');
  const disabled = _.get(props, 'disabled', 'disabled:opacity-10 disabled:pointer-events-none');
  const isDisabled = _.get(props, 'isDisabled', '');
  const variant = _.get(props, 'variant', '');
  const rightArrow = _.get(props, 'rightArrow', '');
  const reverse = _.get(props, 'reverse', '');
  const transition = _.get(props, 'transition', 'transition-all duration-300 ease-in-out');

  // Get classes for the specified variant
  const variantClass = variantClasses[variant] || '';

  // Create the className string using Lodash
  const buttonClasses = _.filter([
    'inline-flex cursor-pointer items-center justify-center',
    reverse ? 'flex-row-reverse' : '',
    w,
    h,
    px,
    py,
    bg,
    hover,
    text,
    font,
    z,
    leading,
    shadow,
    rounded,
    disabled,
    transition,
    border,
    variantClass,
  ]).join(' ');

  // Function to render button content-type
  const renderButtonContent = () => (
    <>
      {!_.isEmpty(rightArrow) && <Icons name={rightArrow} className="min-w-[16px]" />}
      {label}
    </>
  );

  // Determine the type of button based on the presence of a URL and whether it's external
  if (url) {
    if (external) {
      return (
        <a
          aria-label={ariaLabel}
          href={url || '#'}
          target="_blank"
          className={buttonClasses}
          rel="noreferrer">
          {renderButtonContent()}
        </a>
      );
    }
    return (
      <Link
        href={url || '#'}
        aria-label={ariaLabel}
        target={target}
        onClick={clickHandler}
        className={buttonClasses}>
        {renderButtonContent()}
      </Link>
    );
  }
  return (
    _.isEmpty(label) || (
      <button
        aria-label={ariaLabel}
        type="button"
        onClick={clickHandler}
        disabled={isDisabled}
        className={buttonClasses}>
        {renderButtonContent()}
      </button>
    )
  );
}
