import _ from 'lodash';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image';
import BoxedContainer from './layout/boxed-container';

export default function RotateView({ data, id }) {
  const rotateViewImages =
    _.get(data, 'properties.rotateViewImages', null) ||
    _.get(data, 'properties.threeSixtyImages', []);
  const [swiper, setSwiper] = useState(null);
  const [currIndex, setCurrIndex] = useState(0);
  const handleNext = () => {
    if (swiper) {
      swiper.slideTo(
        currIndex < rotateViewImages.length - 1 ? currIndex + 1 : rotateViewImages.length - 1,
      );
    }
  };

  const handlePrev = () => {
    if (swiper) {
      swiper.slideTo(currIndex > 0 ? currIndex - 1 : currIndex);
    }
  };
  return (
    <section id={id} className="py-10">
      <BoxedContainer>
        <div className="flex flex-col gap-y-[30px]">
          <div className="flex flex-col gap-y-[20px]">
            <div>
              <Swiper
                effect="fade"
                fadeEffect={{
                  crossFade: true,
                }}
                slidesPerView={1}
                spaceBetween={30}
                modules={[EffectFade]}
                onSwiper={setSwiper}
                onSlideChange={(_swiper) => setCurrIndex(_swiper.activeIndex)}>
                {_.map(rotateViewImages, (image, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex w-full items-center justify-center">
                      {_.isEmpty(image) || (
                        <Image
                          src={image.url}
                          alt="Rotate Image"
                          width={967}
                          height={916}
                          className="!relative h-full"
                        />
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {_.isEmpty(rotateViewImages) || (
              <div
                className="absolute top-1/2 z-10 flex w-full -translate-y-1/2 flex-row
                justify-between gap-x-[30px]">
                <button
                  disabled={currIndex === 0}
                  type="button"
                  onClick={handlePrev}
                  className="rotate-view-prev-button disabled:opacity-20 svg-child-path:stroke-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="40"
                    viewBox="0 0 23 40"
                    fill="none">
                    <path d="M21 38L3 20L21 2" stroke="#1A1A1A" strokeWidth="3" />
                  </svg>
                </button>
                <button
                  disabled={currIndex === rotateViewImages.length - 1}
                  type="button"
                  onClick={handleNext}
                  className="rotate-view-next-button w-5 disabled:opacity-20 svg-child-path:stroke-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="40"
                    viewBox="0 0 23 40"
                    fill="none">
                    <path d="M2 2L20 20L2 38" stroke="#1A1A1A" strokeWidth="3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </BoxedContainer>
    </section>
  );
}
