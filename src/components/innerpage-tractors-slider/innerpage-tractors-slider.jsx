'use client';

import React, { useState, useEffect } from 'react';
import { get, filter, isEmpty, map, toLower, trim, isEqual } from 'lodash';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Loading from '@/components/layout/loading';
import { useFetchSpecificData } from '@/hooks/use-fetch-specific-data';
import BoxedContainer from '../layout/boxed-container';
import TitleSection from '../layout/title-section';
import Button from '../layout/button';
import Icons from '../layout/icons';

export default function InnerPageTractorsSlider({ data, region, locale, lang, id, products }) {
  const title = get(data, 'properties.title', '');
  const product = filter(products, (item) => {
    const series = get(item, 'properties.series', '');
    if (series) return isEqual(toLower(trim(series)), toLower(trim(title)));
    return false;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSwiper, setImageSwiper] = useState(null);
  const [slideTitles, setSlideTitles] = useState([]);

  useEffect(() => {
    if (!product) return;
    const titles = map(product, (item) => get(item, 'properties.title', ''));
    setSlideTitles(titles);
  }, []);

  const handleClickNext = () => imageSwiper?.slideNext();
  const handleClickPrev = () => imageSwiper?.slidePrev();

  const handleSlideChange = (swiper) => {
    const { realIndex } = swiper;
    setCurrentIndex(realIndex);
  };

  useEffect(() => {
    if (imageSwiper) {
      imageSwiper.on('slideChange', handleSlideChange);
    }
  }, [imageSwiper]);

  if (isEmpty(products)) return <Loading />;

  return (
    <section id={id} className="pt-[60px] md:pt-[80px] lg:pt-[118px]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-[1920px] pt-[30px] md:pt-[60px]">
        <Swiper
          slidesPerView={3}
          spaceBetween={0}
          loop
          centeredSlides
          onSwiper={setImageSwiper}
          className="swiper-slide-active:!scale-100 swiper-slide-active-text:!block">
          {!isEmpty(product) &&
            product.map((item, index) => (
              <SwiperSlide
                key={index}
                className="!scale-75 transition-all duration-200 ease-in-out">
                <div className="relative">
                  {isEmpty(item.properties.featuresImage) || (
                    <Image
                      src={item.properties.featuresImage[0].url}
                      alt={item.properties.title}
                      fill
                      className="!relative !h-full !w-full object-contain object-bottom"
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
        <BoxedContainer>
          <div className="relative flex flex-row justify-between gap-x-[6px] pt-[27px]">
            <button
              type="button"
              onClick={handleClickPrev}
              className="absolute bottom-[-40px] left-0 z-10 flex
              cursor-pointer items-center justify-center gap-x-[15px]
              whitespace-pre sm:relative sm:bottom-[0px] sm:h-full sm:pt-[40px]
              md:gap-x-[30px] md:pt-[72px] lg:pt-[103px] xl:gap-x-[91px] xl:pt-[117px]
              innpage-tractors-slider-left-arrow">
              <TitleSection
                data={slideTitles[currentIndex === 0 ? product.length - 1 : currentIndex - 1]}
              />
              <Icons name="SliderLeftArrow" />
            </button>
            {!isEmpty(product[currentIndex]) && (
              <div className="text-center">
                <div
                  className="nd:gap-y-[15px] mx-auto flex max-w-[626px] flex-col gap-y-[10px]
                lg:gap-y-[32px]">
                  <div className="flex flex-col gap-y-[5px] md:gap-y-[16px]">
                    <h2
                      className="text-[35px] font-bold leading-1 text-primary
                    md:text-[55px] lg:text-[87px] xl:text-[100px]">
                      {product[currentIndex].properties.title}
                    </h2>
                    <div className="text-clamp20to28 font-bold uppercase leading-1.42">
                      {product[currentIndex].properties.subCategory}
                    </div>
                  </div>
                  <p
                    className="text-[15px] font-normal leading-[26px] text-primary
                    lg:text-[18px] lg:leading-[32px]">
                    {product[currentIndex].properties.description}
                  </p>
                  {isEmpty(product[currentIndex].route) || (
                    <div className="flex w-full justify-center">
                      <Button
                        label={`See ${product[currentIndex].properties.title} Details`}
                        url={product[currentIndex].route.path}
                        variant="primaryMercury"
                        text="lg:w-[350px] w-[250px] innpage-tractors-slider-link"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleClickNext}
              className="absolute bottom-[-40px] right-0 z-10 flex
              cursor-pointer items-center justify-center gap-x-[15px]
              whitespace-pre sm:relative sm:bottom-[0px] sm:h-full sm:pt-[40px] md:gap-x-[30px]
              md:pt-[72px] lg:pt-[103px] xl:gap-x-[91px] xl:pt-[117px] innpage-tractors-slider-right-arrow">
              <Icons name="SliderRightArrow" />
              <TitleSection
                data={slideTitles[currentIndex === product.length - 1 ? 0 : currentIndex + 1]}
              />
            </button>
          </div>
        </BoxedContainer>
      </motion.div>
    </section>
  );
}
