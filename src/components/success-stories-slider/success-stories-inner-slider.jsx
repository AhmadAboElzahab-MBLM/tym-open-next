'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode, Thumbs, EffectFade } from 'swiper/modules';
import _ from 'lodash';
import Image from 'next/image';
import BoxedContainer from '../layout/boxed-container';
import Button from '../layout/button';
import SliderPrevNext from '../layout/slider-prev-next';
import SubtitleSection from '../layout/subtitle-section';
import TitleSection from '../layout/title-section';

export default function SuccessStoriesInnerSlider({ headline, customerStory, link }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSwiper, setImageSwiper] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedStory, setSelectedStory] = useState(customerStory[0] || {});
  const handleClickNext = () => imageSwiper?.slideNext();
  const handleClickPrev = () => imageSwiper?.slidePrev();

  const handleThumbSlideChange = ({ activeIndex }) => {
    setCurrentIndex(activeIndex);
    setSelectedStory(customerStory[activeIndex]);
    thumbsSwiper.slideTo(activeIndex);
  };

  const handleImageSlideChange = ({ activeIndex }) => {
    setCurrentIndex(activeIndex);
    setSelectedStory(customerStory[activeIndex]);
    imageSwiper.slideTo(activeIndex);
  };

  const breakpointsthumb = {
    0: {
      slidesPerView: 4,
      spaceBetween: 4,
      slidesPerGroup: 1,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 8,
      slidesPerGroup: 1,
    },
  };

  // console.log(selectedStory);

  return (
    <section id="success-stories" className="overflow-hidden pt-10 md:pt-[60px] lg:pt-[80px]">
      <BoxedContainer className="z-20 flex flex-col gap-7 border-b border-b-cherry lg:flex-row">
        <div className="lg:max-w-[448px]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}>
            <SubtitleSection data={headline} className="tracking-[1px] lg:tracking-[1.5px]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}>
            <Swiper
              effect="fade"
              fadeEffect={{
                crossFade: true,
              }}
              thumbs={{
                swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[FreeMode, Thumbs, EffectFade]}
              onSwiper={setImageSwiper}
              onSlideChange={handleThumbSlideChange}>
              {_.map(customerStory, (item, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="flex max-w-[675px] flex-col gap-4 pt-[22px] md:gap-6 md:pt-[26px]
                    lg:gap-8 lg:pt-[30px]">
                    <TitleSection data={item.properties.subtitle} />
                    <p className="line-clamp-3 font-noto text-clamp14to18 leading-1.77">
                      {item.properties.description}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
          {_.isEmpty(customerStory) || (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex h-fit flex-row items-center gap-x-[20px] pt-[20px] md:gap-x-[32px]
              lg:pt-[32px]">
              <div>
                <Swiper
                  breakpoints={breakpointsthumb}
                  hashNavigation={{
                    watchState: true,
                  }}
                  onSwiper={setThumbsSwiper}
                  onSlideChange={handleImageSlideChange}
                  className="swiper-slide:relative swiper-slide:cursor-pointer
                  swiper-slide-thumb-active:!opacity-100 swiper-wrapper:w-[60px]">
                  {_.map(customerStory, (item, index) => (
                    <SwiperSlide key={index}>
                      <p
                        className="font-noto text-[13px] font-bold uppercase leading-[24px]
                        text-primary opacity-25 md:text-[15px]">
                        {index + 1}
                      </p>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <SliderPrevNext
                slideCount={customerStory?.length}
                handleClickPrev={handleClickPrev}
                handleClickNext={handleClickNext}
                imageSwiper={imageSwiper}
                currentIndex={currentIndex}
              />
            </motion.div>
          )}

          {_.isEmpty(link) || (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className="mb-4 pt-[20px] md:mb-0 lg:pt-[42px]">
              <Button
                label={link[0].title}
                url={link[0].url}
                variant="primaryMercury"
                className="inline-block w-[250px] lg:w-[353px]"
              />
            </motion.div>
          )}
        </div>
        <div className="lg:w-[779px]">
          {_.isEmpty(selectedStory) || (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className="relative z-10">
              <Image
                src={
                  _.get(selectedStory, 'properties.innerPageFeaturedImage[0].url', null) ||
                  'https://tym-new.euwest01.umbraco.io/media/2tjhemkp/success-stories-placeholder.png'
                }
                alt={headline || 'image'}
                fill
                className="!relative h-auto w-full"
              />
            </motion.div>
          )}
        </div>
      </BoxedContainer>
    </section>
  );
}
