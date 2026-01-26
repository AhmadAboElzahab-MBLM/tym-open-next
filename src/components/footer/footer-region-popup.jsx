import React from 'react';
import Icons from '../layout/icons';

export default function FooterRegionPopup({
  handleRegionChange,
  handleCloseModal,
  southKoreaText,
  internationalText,
  northAmericaText,
  deutschlandText,
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-[200] flex h-screen w-full
    items-center justify-center bg-[#E5E5E5] bg-opacity-50 px-6">
      <div className="w-[994px] border border-[#ccc] bg-white md:min-h-[584px]">
        <div className="border-b border-[#ccc]">
          <div className="flex flex-row justify-between gap-5 p-5 md:p-12">
            <h3
              className="font-noto text-clamp14to15 font-bold uppercase tracking-[1px]
              text-black md:tracking-[1.5px]">
              Change Region:
            </h3>
            <button type="button" onClick={handleCloseModal} className='close-button-region-selector'>
              <Icons name="Close" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-7 p-5 pb-7 md:flex-row md:p-12 md:pb-[60px] lg:gap-20">
          <div className="flex flex-col justify-between gap-y-4 md:w-[calc(33.3333%-44px)]">
            <div className="flex flex-col gap-y-2 md:gap-y-4">
              <div className="hidden h-[177px] md:block">
                <Icons name="SouthKorea" />
              </div>
              <h4 className="font-noto text-clamp14to15 font-bold text-black">South Korea</h4>
              <p className="font-noto text-clamp14to15 font-normal text-black">{southKoreaText}</p>
            </div>

            <div className="flex flex-row gap-4 md:pt-4">
              <button
                type="button"
                onClick={() => handleRegionChange('ko')}
                className="flex h-[40px] w-[100px] items-center justify-center bg-[#C91820]
              font-sans text-[13px] font-bold leading-[185%] text-white region-selector-ko-button">
                한국어
              </button>
              <button
                type="button"
                onClick={() => handleRegionChange('en-ko')}
                className="flex h-[40px] w-[100px] items-center justify-center bg-[#C91820]
              font-sans text-[13px] font-bold uppercase leading-[185%] text-white region-selector-en-ko-button">
                ENGLISH
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-y-4 md:w-[calc(33.3333%-44px)]">
            <div className="flex flex-col gap-y-2 md:gap-y-4">
              <div className="hidden h-[177px] md:block">
                <Icons name="NorthAmerica" />
              </div>
              <h4 className="font-noto text-clamp14to15 font-bold text-black">North America</h4>
              <p className="font-noto text-clamp14to15 font-normal text-black">
                {northAmericaText}
              </p>
            </div>
            <div className="flex flex-row gap-4 md:pt-4">
              <button
                type="button"
                onClick={() => handleRegionChange('en-us')}
                className="flex h-[40px] w-[100px] items-center justify-center bg-[#C91820]
              font-sans text-[13px] font-bold uppercase leading-[185%] text-white region-selector-en-us-button">
                ENGLISH
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-y-4 md:w-[calc(33.3333%-44px)]">
            <div className="flex flex-col gap-y-2 md:gap-y-4">
              <div className="hidden h-[177px] md:block">
                <Icons name="International" />
              </div>
              <h4 className="font-noto text-clamp14to15 font-bold text-black">International</h4>
              <p className="font-noto text-clamp14to15 font-normal text-black">
                {internationalText}
              </p>
            </div>
            <div className="flex flex-row gap-4 md:pt-4">
              <button
                type="button"
                onClick={() => handleRegionChange('en')}
                className="flex h-[40px] w-[100px] items-center justify-center bg-[#C91820]
              font-sans text-[13px] font-bold uppercase leading-[185%] text-white region-selector-en-button">
                ENGLISH
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-y-4 md:w-[calc(33.3333%-44px)]">
            <div className="flex flex-col gap-y-2 md:gap-y-4">
              <div className="hidden h-[177px] md:block">
                <Icons name="International" />
              </div>
              <h4 className="font-noto text-clamp14to15 font-bold text-black">Deutschland</h4>
              <p className="font-noto text-clamp14to15 font-normal text-black">
                {deutschlandText}
              </p>
            </div>
            <div className="flex flex-row gap-4 md:pt-4">
              <button
                type="button"
                onClick={() => handleRegionChange('de')}
                className="flex h-[40px] w-[100px] items-center justify-center bg-[#C91820]
              font-sans text-[13px] font-bold uppercase leading-[185%] text-white region-selector-en-button">
                DEUTSCH
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
