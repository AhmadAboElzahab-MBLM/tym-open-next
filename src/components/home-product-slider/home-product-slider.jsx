/* eslint-disable react/no-danger */
/* eslint-disable no-underscore-dangle */

import React, { useState, useContext } from 'react';
import _ from 'lodash';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getTranslationByKey } from '@/utils/translation-helper';
import { formatKeyToLabel } from '@/helpers/product-handlers';
import GlobalContext from '@/context/global-context';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import BoxedContainer from '../layout/boxed-container';
import TitleSection from '../layout/title-section';
import Button from '../layout/button';
import Icons from '../layout/icons';
import HomeProductSliderList from './home-product-slider-list';
import 'swiper/css';

export default function HomeProductSlider({ data, lang }) {
  const { translations } = useContext(GlobalContext);
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const link = _.get(data, 'properties.link', []);
  const items = _.get(data, 'properties.items.items', []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSwiper, setImageSwiper] = useState(null);
  const [imageItemSwiper, setImageItemSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const productItems = _.get(items[currentIndex], 'content.properties.productItems', []);

  if (!items || items.length === 0) {
    return null;
  }

  // if (!productItems || productItems.length === 0) {
  //   return null;
  // }

  const handleLabel = (val) => {
    let label;
    const series = _.get(val, 'content.properties.series', null);
    const subCategory = _.get(val, 'content.properties.subCategory', null);
    const category = _.get(val, 'content.properties.category', null);

    if (series && subCategory && category) {
      label = `${getTranslationByKey(series, translations, lang)}, ${getTranslationByKey(subCategory, translations, lang)} ${getTranslationByKey(category, translations, lang)}`;
    } else {
      label = getTranslationByKey(category, translations, lang);
    }

    return label;
  };

  const handleClickNext = () => {
    if (imageSwiper) {
      imageSwiper.slideNext();
    }

    if (imageItemSwiper && imageItemSwiper.initialized) {
      imageItemSwiper.slideTo(0);
    } else {
      console.warn('imageItemSwiper is not initialized or has no slides');
    }
  };

  const handleClickPrev = () => {
    if (imageSwiper) {
      imageSwiper.slidePrev();
    }

    if (imageItemSwiper && imageItemSwiper.initialized) {
      imageItemSwiper.slideTo(0);
    } else {
      console.warn('imageItemSwiper is not initialized or has no slides');
    }
  };

  const handleItemClickNext = () => {
    if (imageItemSwiper && imageItemSwiper.slideNext) {
      imageItemSwiper.slideNext();
    } else {
      console.error('Swiper instance is not available');
    }
  };

  const handleItemClickPrev = () => {
    if (imageItemSwiper && imageItemSwiper.slidePrev) {
      imageItemSwiper.slidePrev();
    } else {
      console.error('Swiper instance is not available');
    }
  };

  const breakpoints = {
    0: {
      slidesPerView: 2,
      spaceBetween: 16,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 32,
    },
  };

  return (
    <section id="home-product-slider" className="">
      <BoxedContainer>
        <div className="mb-8 h-[1px] w-full bg-cherry md:hidden" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[928px] flex-col gap-y-[20px]
          lg:gap-y-[40px]">
          <div className="flex flex-col gap-y-5 text-center">
            {_.isEmpty(title) || (
              <div
                className="font-sans text-clamp20to28 font-bold uppercase leading-1.42 text-primary
                "
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {_.isEmpty(text) || (
              <div
                className="font-noto text-clamp14to18 font-normal leading-1.77 text-primary"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
          {!_.isEmpty(link) && (
            <>
              {resolveInternalLinks(link[0], lang)}
              <Button
                url={link[0].url}
                label={link[0].title}
                variant="primaryText"
                text="!whitespace-normal"
                rightArrow="ArrowRight"
              />
            </>
          )}
        </motion.div>
      </BoxedContainer>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        viewport={{ once: true }}
        className="max-w-120 relative mx-auto pt-8 md:pt-16">
        <Swiper
          loop
          spaceBetween={0}
          centeredSlides
          onSwiper={setImageSwiper}
          onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
          breakpoints={{
            0: {
              initialSlide: 0,
              slidesPerView: 1,
            },
            768: {
              initialSlide: 1,
              slidesPerView: 3,
            },
          }}
          className="relative swiper-slide-active:opacity-100">
          {_.map(items, (item, index) => {
            const image = _.get(item, 'content.properties.image[0]', null);
            return (
              <SwiperSlide
                key={index}
                className="!flex !justify-center opacity-20 transition-all
                    duration-200 ease-in-out">
                {_.isEmpty(image) || (
                  <Image
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={image.url}
                    alt={image.name}
                    className="!relative !h-[500px] object-contain md:!w-auto xl:!h-[600px]
                    4xl:!h-[900px]"
                  />
                )}
              </SwiperSlide>
            );
          })}
          <div className="absolute top-1/2 z-10 hidden w-full lg:block">
            <div className="container z-10 mx-auto flex w-full max-w-[1150px] items-center justify-between">
              <button
                type="button"
                onClick={handleClickPrev}
                className="svg-child-path:stroke-[#1d1d1b]">
                <Icons name="PrevButton" className="h-10 w-10" />
              </button>
              <button
                type="button"
                onClick={handleClickNext}
                className="svg-child-path:stroke-[#1d1d1b]">
                <Icons name="NextButton" className="h-10 w-10" />
              </button>
            </div>
          </div>
        </Swiper>

        <BoxedContainer>
          <div className="relative grid grid-cols-12 gap-x-1.5 pt-6 md:pt-7">
            <button
              type="button"
              onClick={handleClickPrev}
              className="home-product-slider-button relative  left-1 z-10 flex cursor-pointer justify-center gap-x-4
              pt-12 sm:col-span-3 sm:h-fit sm:items-center md:left-0 md:pt-18 lg:justify-between
              lg:pt-25 xl:pt-[122px]">
              <TitleSection
                data={getTranslationByKey(
                  items[currentIndex === 0 ? items.length - 1 : currentIndex - 1]?.content
                    ?.properties?.series ||
                    items[currentIndex === 0 ? items.length - 1 : currentIndex - 1]?.content
                      ?.properties?.category,
                  translations,
                  lang,
                )}
                className="hidden truncate whitespace-break-spaces !text-clamp18to22 lg:block"
              />
              <Icons name="SliderLeftArrow" className="!min-w-[10px]" />
            </button>
            {_.isEmpty(items[currentIndex]) || (
              <div className="start-4 col-span-10 text-center sm:col-span-6">
                <div className="mx-auto flex flex-col gap-y-2.5 md:gap-y-4 lg:gap-y-8">
                  <div className="flex flex-col gap-y-1.5 md:gap-y-4">
                    <h2
                      className="promo-font whitespace-nowrap text-[32px] font-bold leading-1
                      text-primary md:text-[55px] lg:text-[80px] xl:text-[100px]">
                      {items[currentIndex].content.properties.range}
                    </h2>
                    <TitleSection
                      data={getTranslationByKey(
                        handleLabel(items[currentIndex]),
                        translations,
                        lang,
                      )}
                    />
                  </div>
                  <p
                    className="line-clamp-2 font-noto text-clamp16to18 font-normal leading-1.75
                    text-primary">
                    {items[currentIndex].content.properties.text}
                  </p>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleClickNext}
              className="z-10 flex cursor-pointer justify-center gap-x-4 pt-12 sm:col-span-3
              sm:h-fit sm:items-center md:pt-18 lg:justify-between lg:pt-25 xl:pt-[122px]">
              <Icons name="SliderRightArrow" className="!min-w-[10px]" />
              <TitleSection
                data={getTranslationByKey(
                  items[currentIndex === items.length - 1 ? 0 : currentIndex + 1]?.content
                    ?.properties?.series ||
                    items[currentIndex === items.length - 1 ? 0 : currentIndex + 1]?.content
                      ?.properties?.category,
                  translations,
                  lang,
                )}
                className="hidden truncate whitespace-break-spaces !text-clamp18to22 lg:block"
              />
            </button>
          </div>
        </BoxedContainer>
      </motion.div>
      <BoxedContainer className="!px-8 xl:!px-0">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="relative flex flex-wrap justify-center gap-4 pb-10 pt-5 md:gap-8
          md:pt-12.5 lg:pb-[120px] lg:pt-[60px]">
          {productItems &&
            (productItems.length > 4 ? (
              <>
                <Swiper
                  className="product-swiper"
                  breakpoints={breakpoints}
                  onSwiper={setImageItemSwiper}
                  onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}>
                  {_.map(productItems, (item, index) => {
                    resolveInternalLinks(item, lang);
                    return (
                      <SwiperSlide key={index}>
                        <HomeProductSliderList
                          data={item}
                          key={index}
                          text={formatKeyToLabel(handleLabel(items[currentIndex]))}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
                {productItems.length > 4 ? (
                  <div className="absolute top-[35%] w-full">
                    <div className="container z-10 mx-auto flex w-full max-w-[1333px] items-center justify-between">
                      <button
                        type="button"
                        onClick={handleItemClickPrev}
                        disabled={activeIndex === 0}
                        className={`ml-[-30px] svg-child-path:stroke-black ${
                          activeIndex === 0 ? 'opacity-50' : ''
                        }`}>
                        <Icons name="PrevButton" className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        onClick={handleItemClickNext}
                        disabled={activeIndex === productItems.length - 1}
                        className={`svg-child-path:stroke-black ${
                          activeIndex === productItems.length - 1 ? ' opacity-50' : ''
                        }`}>
                        <Icons name="NextButton" className="mr-[-30px] h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </>
            ) : (
              _.map(productItems, (item, index) => {
                resolveInternalLinks(item, lang);
                return (
                  <HomeProductSliderList
                    data={item}
                    key={index}
                    className="!w-[calc(50%-8px)] md:!w-[calc(25%-24px)] "
                    text={formatKeyToLabel(handleLabel(items[currentIndex]))}
                  />
                );
              })
            ))}
        </motion.div>
        <div className="h-[1px] w-full bg-cherry" />
      </BoxedContainer>
    </section>
  );
}
