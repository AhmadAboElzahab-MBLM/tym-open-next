'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { EffectFade, FreeMode, Thumbs } from 'swiper/modules';
import Image from 'next/image';
import _ from 'lodash';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';

export default function HistoryTimeline({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const items = _.get(data, 'properties.items.items', []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSwiper, setImageSwiper] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const breakpoints = {
    0: {
      slidesPerView: 1,
      direction: 'horizontal',
      autoHeight: 'true',
    },
    768: {
      autoHeight: 'true',
      slidesPerView: 1,
      direction: 'horizontal',
      spaceBetween: 0,
    },
    1024: {
      slidesPerView: 1,
      direction: 'vertical',
      autoHeight: 'true',
    },
  };

  const breakpointsthumb = {
    0: {
      slidesPerView: 3,
      direction: 'horizontal',
      spaceBetween: 5,
    },
    768: {
      slidesPerView: 4,
      direction: 'horizontal',
      spaceBetween: 35,
      slidesPerGroup: 1,
    },
    1024: {
      slidesPerView: 12,
      direction: 'vertical',
      spaceBetween: 0,
      slidesPerGroup: 1,
    },
  };

  const handleThumbSlideChange = ({ activeIndex }) => {
    setCurrentIndex(data[activeIndex]);
    thumbsSwiper.slideTo(activeIndex);
  };

  const handleImageSlideChange = ({ activeIndex }) => {
    setCurrentIndex(data[activeIndex]);
    imageSwiper.slideTo(activeIndex);
  };

  return (
    <section id={id} className="pt-10 md:pt-[60px] lg:pt-[80px]">
      <BoxedContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col gap-y-[15px] lg:gap-y-[32px]">
          <TitleSection data={title} />
          {_.isEmpty(text) || (
            <div
              className="flex max-w-[960px] flex-col gap-y-2
              font-noto text-clamp14to18 font-normal leading-1.77 text-primary md:gap-y-5 lg:gap-y-[32px]"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </motion.div>
      </BoxedContainer>
      {_.isEmpty(items) || (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto mt-[20px] max-w-[1522px] border border-grey px-4
          lg:mt-[80px] lg:border-0">
          <div>
            <Swiper
              breakpoints={breakpoints}
              effect="fade"
              fadeEffect={{
                crossFade: true,
              }}
              slidesPerView={1}
              spaceBetween={30}
              thumbs={{
                swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[FreeMode, Thumbs, EffectFade]}
              onSwiper={setImageSwiper}
              onSlideChange={handleThumbSlideChange}
              className="vertical-slider-image swiper-slide:md:!h-full
              swiper-wrapper:lg:!h-[800px] swiper-wrapper:2xl:!h-[913px]">
              {_.map(items, (item, index) => {
                const itemImage = _.get(item, 'content.properties.image[0]', {});
                const itemTitle = _.get(item, 'content.properties.title.markup', '');
                const itemSubtitle = _.get(item, 'content.properties.subtitle', '');
                const itemText = _.get(item, 'content.properties.text.markup', '');

                return (
                  <SwiperSlide
                    key={index}
                    className="!flex flex-col items-center gap-x-[180px] lg:flex-row
                    lg:gap-x-[21%] lg:border lg:border-grey">
                    <div className="!h-full w-full lg:w-[42%]">
                      {_.isEmpty(itemImage) || (
                        <Image
                          src={itemImage.url}
                          alt={itemImage.name}
                          fill
                          className="!relative mx-auto !h-full !max-h-[380px] !w-auto
                          !object-cover
                          lg:!max-h-full"
                        />
                      )}
                    </div>
                    <div className="flex !h-full flex-col justify-center py-6 pr-[8%] lg:w-[37%]">
                      <div className=" flex flex-col gap-y-[10px] lg:gap-y-[15px] xl:gap-y-[32px]">
                        <h5
                          className="font-noto text-clamp12to15 font-bold uppercase
                          tracking-[1px] md:tracking-[1.5px]">
                          {itemSubtitle}
                        </h5>
                        <TitleSection data={itemTitle} />
                        {_.isEmpty(itemText) || (
                          <div
                            className="flex flex-col gap-y-2 font-noto
                            text-clamp14to15 font-normal leading-[160%] text-primary
                            lg:gap-y-[20px]"
                            dangerouslySetInnerHTML={{ __html: itemText }}
                          />
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div
            className="swiper-thumb z-10 pt-1 lg:absolute lg:!left-[44%] lg:top-1/2
            lg:w-[170px] lg:-translate-y-1/2
          lg:pt-0">
            <Swiper
              breakpoints={breakpointsthumb}
              hashNavigation={{
                watchState: true,
              }}
              onSwiper={setThumbsSwiper}
              onSlideChange={handleImageSlideChange}
              direction="vertical"
              className="swiper-slide-thumb-active:text-cherry swiper-wrapper:lg:h-[700px]
              swiper-wrapper:lg:w-[auto] swiper-wrapper:lg:justify-center">
              {_.map(items, (item, index) => {
                const itemPeriod = _.get(item, 'content.properties.period', '');

                return (
                  <SwiperSlide
                    key={index}
                    className="!xl:h-[60px] z-10 !flex !h-[50px] cursor-pointer
                    items-center lg:!w-[172px]">
                    <span className="w-[18px]" />
                    <p
                      className="ml-1.5 font-noto text-[12px] font-bold uppercase
                      leading-[1] tracking-[1px] text-primary md:ml-[10px] md:text-[15px]
                      md:tracking-[1.5px] xl:ml-[20px]">
                      {itemPeriod}
                    </p>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </motion.div>
      )}
    </section>
  );
}
