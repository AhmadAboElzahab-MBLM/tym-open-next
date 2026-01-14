/* eslint-disable react/no-danger */
/* eslint-disable no-underscore-dangle */

import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getTranslationByKey } from '@/utils/translation-helper';
import {
  formatKeyToLabel,
  groupProductsByCategoryAndSubcategory,
} from '@/helpers/product-handlers';
import Loading from '@/components/layout/loading';
import GlobalContext from '@/context/global-context';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import BoxedContainer from '../layout/boxed-container';
import TitleSection from '../layout/title-section';
import Button from '../layout/button';
import Icons from '../layout/icons';
import HomeTractorSliderList from './home-tractor-slider-list';
import 'swiper/css';

export default function HomeTractorSlider({ data, lang }) {
  const { translations } = useContext(GlobalContext);

  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const link = _.get(data, 'properties.link', []);
  const productItems = _.get(data, 'properties.productItems.items', []);
  const [groupedProducts, setGroupedProducts] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSwiper, setImageSwiper] = useState(null);
  const flattenedProducts = _.flatten(_.map(productItems, 'content.properties.productItems'));

  _.forEach(flattenedProducts, (product) => {
    resolveInternalLinks(product, lang);
  });

  const handleClickNext = () => {
    if (imageSwiper) {
      imageSwiper.slideNext();
    }
  };
  const handleClickPrev = () => {
    if (imageSwiper) {
      imageSwiper.slidePrev();
    }
  };

  useEffect(() => {
    if (!_.isEmpty(flattenedProducts)) {
      const filteredProducts = _.filter(
        flattenedProducts,
        (product) => !_.get(product, 'properties.hideFromListing', false),
      );
      const grouped = groupProductsByCategoryAndSubcategory(filteredProducts);

      const order = [
        'tractors/sub_compact/series_1',
        'tractors/compact/series_2',
        'tractors/compact/series_3',
        'tractors/compact_utility/series_4',
        'tractors/utility/series_5',
        'tractors/utility/series_6',
        'tractors/import/iseki',
        'tractors/import/john_deere',
        'harvesters/no_subcategory/no_series',
        'rice_transplanters/no_subcategory/no_series',
        'diesel_engines/no_subcategory/no_series',
      ];

      const customSort = (valueA, valueB) => {
        const aIndex = _.findIndex(order, (prefix) => _.startsWith(valueA.key, prefix));
        const bIndex = _.findIndex(order, (prefix) => _.startsWith(valueB.key, prefix));

        return _.defaultTo(_.subtract(aIndex, bIndex), 0);
      };

      grouped.sort(customSort);

      setGroupedProducts(grouped);
    }
  }, []);

  const getRangeKO = (product) => {
    if (product.key.includes('john_deere')) {
      return '110 - 290 PS';
    }
    return product.rangeKO || '';
  };

  if (_.isEmpty(groupedProducts)) return <Loading />;

  // console.log(formatKeyToLabel(_.get(groupedProducts, `[${currentIndex}].key`, {})));

  return (
    <section id="home-tractor-slider" className="pt-12 md:pt-0">
      <BoxedContainer>
        <div className="h-[1px] w-full bg-cherry md:hidden" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[928px] flex-col gap-y-[20px] pt-12
          lg:gap-y-[40px] lg:pt-[115px]">
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
          initialSlide={0}
          slidesPerView="auto"
          centeredSlides
          onSwiper={setImageSwiper}
          onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
          breakpoints={{
            768: {
              initialSlide: 1,
            },
          }}>
          {_.map(groupedProducts, (item, index) => {
            // console.log(item);
            const image = _.get(item, 'sliderFrontImage', null) || _.get(item, 'image', null);
            return (
              <SwiperSlide key={index} className="px-2 md:inline-flex md:!w-auto lg:px-6">
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
        </Swiper>
        <BoxedContainer>
          <div className="relative grid grid-cols-12 gap-x-1.5 pt-6 md:pt-7">
            <button
              type="button"
              onClick={handleClickPrev}
              className="relative left-1  z-10 flex cursor-pointer justify-center gap-x-4 pt-12
              sm:col-span-3 sm:h-fit sm:items-center md:left-0 md:pt-18 lg:justify-between lg:pt-25
              xl:pt-[122px]">
              <TitleSection
                data={getTranslationByKey(
                  formatKeyToLabel(
                    groupedProducts[
                      currentIndex === 0 ? groupedProducts.length - 1 : currentIndex - 1
                    ]?.key,
                    true,
                  ),
                  translations,
                  lang,
                )}
                className="hidden truncate whitespace-break-spaces !text-clamp18to22 lg:block"
              />
              <Icons name="SliderLeftArrow" className="!min-w-[10px]" />
            </button>
            {_.isEmpty(groupedProducts[currentIndex]) || (
              <div className="start-4 col-span-10 text-center sm:col-span-6">
                <div className="mx-auto flex flex-col gap-y-2.5 md:gap-y-4 lg:gap-y-8">
                  <div className="flex flex-col gap-y-1.5 md:gap-y-4">
                    <h2
                      className="promo-font whitespace-nowrap text-[32px] font-bold leading-1
                      text-primary md:text-[55px] lg:text-[80px] xl:text-[100px]">
                      {getRangeKO(groupedProducts[currentIndex])}
                    </h2>
                    <TitleSection
                      data={getTranslationByKey(
                        formatKeyToLabel(groupedProducts[currentIndex].key),
                        translations,
                        lang,
                      )}
                    />
                  </div>
                  <p
                    className="line-clamp-2 font-noto text-clamp16to18 font-normal leading-1.75
                    text-primary">
                    {groupedProducts[currentIndex].shortDescription}
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
                  formatKeyToLabel(
                    groupedProducts[
                      currentIndex === groupedProducts.length - 1 ? 0 : currentIndex + 1
                    ]?.key,
                    true,
                  ),
                  translations,
                  lang,
                )}
                className="hidden truncate whitespace-break-spaces !text-clamp18to22 lg:block"
              />
            </button>
          </div>
        </BoxedContainer>
      </motion.div>
      <BoxedContainer className="">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 pb-10 pt-5 md:gap-8 md:pt-12.5
          lg:pb-[120px] lg:pt-[60px]">
          {_.map(
            _.get(groupedProducts, `[${currentIndex}].values`, []).slice(0, 4),
            (item, index) => (
              <HomeTractorSliderList
                data={item}
                key={index}
                text={formatKeyToLabel(_.get(groupedProducts, `[${currentIndex}].key`, {}))}
              />
            ),
          )}
        </motion.div>
        <div className="h-[1px] w-full bg-cherry" />
      </BoxedContainer>
    </section>
  );
}
