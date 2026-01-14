'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import { FreeMode, EffectFade, Autoplay } from 'swiper/modules';
import { usePathname } from 'next/navigation';
import { map, isEmpty, get, some, isEqual } from 'lodash';
import Image from 'next/image';
import { motion } from 'framer-motion';

import resolveInternalLinks from '@/helpers/resolve-url-locale';
import Link from 'next/link';
import BoxedContainer from './layout/boxed-container';
import Button from './layout/button';
import Icons from './layout/icons';

export default function HomeBannerSlider({ data, id, lang, setIsDarkNav }) {
  const [swiper, setSwiper] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  // Memoize items to prevent new object reference on every render
  const items = useMemo(() => data?.properties?.items?.items || [], [data]);
  const [isVisible, setIsVisible] = useState(true);
  const paths = ['/en', '/en-ko', '/en-us', '/ko'];

  const path = usePathname();
  const isHome = some(paths, (_path) => isEqual(path, _path));

  useEffect(() => {
    if (items && items.length > 0) {
      const initialItem = items[0];
      setIsDarkNav(get(initialItem, 'content.properties.darkNav', false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentSlide < items.length - 1) {
      swiper.slideTo(currentSlide + 1);
    } else {
      swiper.slideTo(0);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      swiper.slideTo(currentSlide - 1);
    } else {
      swiper.slideTo(items.length - 1);
    }
  };

  const elipsisTextStyle = {
    maxWidth: '100%',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <section id={id} className="relative h-screen w-full">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        fadeEffect={{ crossFade: true }}
        effect="fade"
        speed={1000}
        modules={[FreeMode, EffectFade, Autoplay]}
        autoplay={path === '/en-us' ? { delay: 3000, disableOnInteraction: false } : false}
        onSwiper={setSwiper}
        onSlideChange={(_swiper) => {
          setCurrentSlide(_swiper.activeIndex);
          const currentItem = items[_swiper.activeIndex];
          setIsDarkNav(get(currentItem, 'content.properties.darkNav', false));
        }}
        className="!relative !h-full !w-full">
        {map(items, (item, index) => {
          const image = get(item, 'content.properties.image[0]', null);
          const mobileImage = get(item, 'content.properties.mobileImage[0]', null);
          const link = get(item, 'content.properties.link', null);
          const title = get(item, 'content.properties.title.markup', null);
          const text = get(item, 'content.properties.text.markup', null);
          const extraText = get(item, 'content.properties.extraText.markup', null);
          const bannerVideo = get(item, 'content.properties.bannerVideo', {});

          return (
            <SwiperSlide key={index} className="relative !h-screen !min-h-[32rem]">
              {isEmpty(image) || (
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="hidden !object-cover sm:block"
                />
              )}
              {isEmpty(mobileImage) || (
                <Image
                  src={mobileImage.url}
                  alt={mobileImage.name}
                  fill
                  className="block !object-cover sm:hidden"
                />
              )}
              {!isEmpty(bannerVideo) && (
                <video
                  src={bannerVideo[0].url}
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="video-wrapper video-home-wrapper absolute h-screen w-full object-cover"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100vw',
                    minHeight: '64vh',
                    minWidth: '177.77vh',
                    height: '100vw',
                    minHeight: '100vh',
                  }}
                />
              )}
              <div className="relative z-20 flex h-full w-full pt-7  lg:items-center lg:pt-[60px] 4xl:pt-0">
                <BoxedContainer className="lg:!h-[53vh] lg:!max-h-[572px] px-8 xl:px-0">
                  <div className="relative z-20 flex h-full  flex-col gap-y-10 py-7 4xl:gap-y-20 4xl:py-16">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      viewport={{ once: true }}
                      direction="vertical"
                      className="flex -translate-y-10 lg:translate-y-0 lg:h-full w-full max-w-[286px] flex-col lg:justify-center gap-y-6 md:max-w-[28rem] 4xl:gap-y-10">
                      <div className="flex h-[40vh] lg:h-full justify-end lg:just flex-col gap-y-[12px] 4xl:gap-y-[28px]">
                        {isEmpty(title) || (
                          <div
                            className="promo-font text-clamp28to48 font-bold uppercase leading-1.5 text-white p-child:font-sans p-child-br:hidden third-slider:text-primary lg:leading-[54px] p-child-br:lg:block"
                            dangerouslySetInnerHTML={{ __html: title }}
                          />
                        )}
                        {isEmpty(text) || (
                          <div
                            className="!max-w-[409px] font-noto text-clamp14to18 font-normal leading-1.77 text-white  p-span-child:text-clamp18to28 p-span-child:font-semibold third-slider:text-primary md:max-w-full"
                            style={elipsisTextStyle}
                            dangerouslySetInnerHTML={{ __html: text }}
                          />
                        )}
                      </div>
                      {isEmpty(link) || (
                        <>
                          {resolveInternalLinks(link[0], lang)}
                          <Button
                            url={link[0].url}
                            label={link[0].title}
                            variant="primaryWhite"
                            w="lg:w-[352px] w-fit"
                            text="text-clamp14to15 banner-links"
                            z="20"
                          />
                        </>
                      )}
                    </motion.div>
                  </div>

                </BoxedContainer>
                {isEmpty(extraText) || (
                  <div
                    className='text-clamp16to18 bottom-2 absolute w-[95%] lg:w-[70%] text-primary -translate-x-1/2 left-1/2'
                    dangerouslySetInnerHTML={{ __html: extraText }}
                  />
                )}
              </div>
            </SwiperSlide>
          );
        })}
        {items.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            viewport={{ once: true }}
            className="absolute top-1/2 z-10 w-full">
            <div className="container z-10 mx-auto flex w-full max-w-[1333px] items-center justify-between">
              <button type="button" onClick={handlePrev}>
                <Icons name="PrevButton" className="h-6 w-6" />
              </button>
              <button type="button" onClick={handleNext}>
                <Icons name="NextButton" className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        )}
      </Swiper>
      {lang === 'en-us' && isHome && isVisible && (
        <div className="fixed bottom-0 z-[40] block w-full">
          <div className="relative mx-auto flex min-h-[50px] max-w-[600px] flex-row items-center gap-5 rounded-t-[4px] bg-[#1A1A1A] p-3 md:px-5 md:pb-[18px] md:pt-[14px]">
            <div className="flex flex-row gap-1 font-noto text-[10px] font-medium text-white md:gap-2 md:text-[15px]">
              Start your journey with TYM:
              <Link href={`/${lang}/products/request-quote`} className="underline">
                Request a Quote
              </Link>{' '}
              or
              <Link href={`/${lang}/find-a-dealer`} className="underline">
                Find a TYM Dealer
              </Link>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 svg-child-path:stroke-white md:right-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[8px] w-[8px] md:h-[12px] md:w-[12px]"
                viewBox="0 0 14 14"
                fill="none">
                <path d="M13 13L7 7L13 1" stroke="white" strokeWidth="2" />
                <path d="M1 13L7 7L1 1" stroke="white" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
