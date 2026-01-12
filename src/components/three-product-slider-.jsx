import React, { useState, useEffect, useContext } from 'react';
import _, { get, filter, kebabCase, isEqual, isEmpty, map, find } from 'lodash';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getTranslationByKey } from '@/utils/translation-helper';
import { motion } from 'framer-motion';
import Image from 'next/image';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import GlobalContext from '@/context/global-context';
import { getProductPower } from '@/helpers/product-handlers';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';
import Button from './layout/button';
import Icons from './layout/icons';

export default function ThreeProductSlider({ data, region, products }) {
  const { lang, translations } = useContext(GlobalContext);
  const id = `theree-product-slider-${kebabCase(region)}`;
  const series = get(data, 'properties.series', '');

  const filteredHideFromListing = filter(
    products,
    (val) => !get(val, 'properties.hideFromListing', false),
  );

  // states
  const [items, setItems] = useState(null);

  // Derived displayItems for Swiper looping with 3 items
  const displayItems = items && items.length === 3 ? [...items, ...items] : items;

  useEffect(() => {
    const filtered = filter(filteredHideFromListing, (item) =>
      isEqual(get(item, 'properties.series', ''), series),
    );
    setItems(filtered);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSwiper, setImageSwiper] = useState(null);

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

  function getPowerLabel(val) {
    const specs = _.get(val, 'properties.specifications.items', []);

    const value = _.reduce(
      specs,
      (acc, curr) => {
        const title = _.get(curr, 'content.properties.title');
        const valueUS = _.get(curr, 'content.properties.valueUS');
        const unitUS = _.get(curr, 'content.properties.unitUS');
        const valueMetric = _.get(curr, 'content.properties.valueMetric');
        const unitMetric = _.get(curr, 'content.properties.unitMetric');

        const langMapping = {
          en: `${valueUS} ${unitUS} | ${valueMetric} ${unitMetric}`,
          'en-us': `${valueMetric} ${unitMetric}`,
          'en-ko': `${valueMetric} ${unitMetric}`,
          ko: `${valueMetric} ${unitMetric}`,
        };

        if (title === 'Engine power') {
          acc += langMapping[lang];
        }
        return acc;
      },
      '',
    );

    return value;
  }

  return !isEmpty(items) && items.length > 2 ? (
    <section id={id} className="pb-[60px] lg:pb-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="max-w-120 relative mx-auto pt-2 md:pt-16">
        <Swiper
          slidesPerView={3}
          spaceBetween={0}
          initialSlide={0}
          loop
          loopAddBlankSlides
          centeredSlides
          onSwiper={setImageSwiper}
          className="relative max-w-[1920px] swiper-slide-active:opacity-100 swiper-slide-active-text:!block
          swiper-wrapper:items-end">
          {map(displayItems, (val, index) => {
            const item = get(val, 'properties', {});
            resolveInternalLinks(displayItems[index], lang);
            return (
              <SwiperSlide
                key={index}
                className="!flex !justify-center opacity-20 transition-all
                    duration-200 ease-in-out">
                <div className="relative w-fit">
                  {isEmpty(get(item, 'sliderFrontImage[0]', {})) || (
                    <Image
                      src={get(item, 'sliderFrontImage[0].url', '')}
                      alt={get(item, 'sliderFrontImage[0].name', '')}
                      priority
                      fill
                      className="!relative !h-[240px] max-h-[800px] !w-auto !object-contain
                      object-bottom md:!h-[600px] 4xl:!h-[800px]"
                    />
                  )}
                </div>
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
          <div className="relative flex flex-row justify-center gap-x-1.5 pt-7">
            <button
              type="button"
              onClick={handleClickPrev}
              className="absolute left-0 z-10 flex cursor-pointer items-center
                  justify-between gap-x-4 whitespace-pre sm:relative sm:bottom-0 sm:h-full
                  sm:pt-10 md:gap-x-8 md:pt-18 lg:w-[180px] lg:pt-25 xl:gap-x-22 xl:pt-29">
              <TitleSection
                data={
                  displayItems[currentIndex === 0 ? displayItems.length - 1 : currentIndex - 1]?.properties.title
                }
              />
              <Icons name="SliderLeftArrow" className="min-h-[14px] min-w-[10px]" />
            </button>
            {isEmpty(displayItems[currentIndex]) || (
              <div className="text-center">
                <div className="mx-auto flex max-w-156 flex-col gap-y-2.5 md:gap-y-4 lg:gap-y-8">
                  <div className="flex flex-col gap-y-1.5 md:gap-y-4">
                    <h2
                      className="promo-font text-[32px] font-bold leading-1
                      text-primary md:text-[55px] lg:text-[86px] xl:text-[100px]">
                      {displayItems[currentIndex]?.properties?.title}
                    </h2>
                    <div className="text-clamp20to28 font-bold leading-1.42">
                      {getProductPower(displayItems[currentIndex], translations, lang).replace(
                        /[()]/g,
                        '',
                      )}
                      ,{' '}
                      <span className="uppercase">
                        {getTranslationByKey(
                          displayItems[currentIndex]?.properties?.subCategory,
                          translations,
                          lang,
                        )}
                      </span>
                    </div>
                  </div>
                  {isEmpty(displayItems[currentIndex]?.properties?.productText) || (
                    <div
                      className="font-noto text-clamp16to18 font-normal leading-1.625 text-primary"
                      dangerouslySetInnerHTML={{
                        __html: displayItems[currentIndex]?.properties?.productText?.markup,
                      }}
                    />
                  )}

                  {lang === 'ko' ? (
                    <Button
                      url={displayItems[currentIndex]?.route.path}
                      label={`${displayItems[currentIndex]?.properties?.title} ${getTranslationByKey('See', translations, lang)} ${getTranslationByKey('Details', translations, lang)}`}
                      variant="primaryMercury"
                      text="!whitespace-normal mt-5"
                      w="w-fit mx-auto"
                    />
                  ) : (
                    <Button
                      url={displayItems[currentIndex]?.route.path}
                      label={`See ${displayItems[currentIndex]?.properties?.title} Details`}
                      variant="primaryMercury"
                      text="!whitespace-normal mt-5"
                      w="w-fit mx-auto"
                    />
                  )}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleClickNext}
              className="absolute right-0 z-10 flex cursor-pointer items-center
                  justify-between gap-x-4 whitespace-pre sm:relative sm:bottom-0 sm:h-full
                  sm:pt-10 md:gap-x-8 md:pt-18 lg:w-[180px] lg:pt-25 xl:gap-x-22 xl:pt-29">
              <Icons name="SliderRightArrow" className="min-h-[14px] min-w-[10px]" />
              <TitleSection
                data={
                  displayItems[currentIndex === displayItems.length - 1 ? 0 : currentIndex + 1]?.properties.title
                }
              />
            </button>
          </div>
        </BoxedContainer>
      </motion.div>
    </section>
  ) : (
    <section id={id} className="pb-[60px] lg:pb-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        viewport={{ once: true }}
        className="max-w-120 relative mx-auto flex flex-col justify-center gap-5 pt-2
        md:flex-row md:gap-10 md:pt-16">
        {map(displayItems, (val, index) => {
          const item = get(val, 'properties', {});
          resolveInternalLinks(displayItems[index], lang);
          return (
            <div
              key={index}
              className="flex flex-col items-center transition-all duration-200 ease-in-out">
              <div className="relative w-fit">
                {isEmpty(get(item, 'sliderFrontImage[0]', {})) || (
                  <Image
                    src={get(item, 'sliderFrontImage[0].url', '')}
                    alt={get(item, 'sliderFrontImage[0].name', '')}
                    priority
                    fill
                    className="!relative !h-[240px] max-h-[800px] !w-auto
                        !object-contain object-bottom md:!h-[600px] 4xl:!h-[800px]"
                  />
                )}
              </div>

              <BoxedContainer>
                <div className="relative flex flex-row justify-center gap-x-1.5 pt-7">
                  {isEmpty(item) || (
                    <div className="text-center">
                      <div
                        className="mx-auto flex max-w-156 flex-col gap-y-2.5 md:gap-y-4
                      lg:gap-y-8">
                        <div className="flex flex-col gap-y-1.5 md:gap-y-4">
                          <h2
                            className="text-[32px] font-bold leading-1 text-primary
                            md:text-[55px] lg:text-[86px] xl:text-[100px]">
                            {item.title}
                          </h2>
                          <div className="text-clamp20to28 font-bold leading-1.42">
                            {getProductPower(val, translations, lang).replace(
                              /[()]/g,
                              '',
                            )}
                            ,{' '}
                            <span className="uppercase">
                              {getTranslationByKey(
                                item.subCategory,
                                translations,
                                lang,
                              )}
                            </span>
                          </div>

                        </div>
                        {isEmpty(item.productText) || (
                          <div
                            className="text-clamp16to18 font-normal leading-1.625 text-primary"
                            dangerouslySetInnerHTML={{
                              __html: item.productText?.markup,
                            }}
                          />
                        )}
                        {lang === 'ko' ? (
                          <Button
                            url={displayItems[index].route.path}
                            label={`${item.title} ${getTranslationByKey('See', translations, lang)} ${getTranslationByKey('Details', translations, lang)}`}
                            variant="primaryMercury"
                            text="!whitespace-normal mt-5"
                            w="w-fit mx-auto"
                          />
                        ) : (
                          <Button
                            url={displayItems[index].route.path}
                            label={`See ${item.title} Details`}
                            variant="primaryMercury"
                            text="!whitespace-normal mt-5"
                            w="w-fit mx-auto"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </BoxedContainer>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
