'use client';

import React, { useContext, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode, Thumbs, EffectFade } from 'swiper/modules';
import _, { get, isEmpty, map, size } from 'lodash';
import Image from 'next/image';
import GlobalContext from '@/context/global-context';
import { useParams } from 'next/navigation';
import BoxedContainer from '../layout/boxed-container';
import Button from '../layout/button';
import SliderPrevNext from '../layout/slider-prev-next';
import SubtitleSection from '../layout/subtitle-section';
import TitleSection from '../layout/title-section';

export default function TestimonialsBlock({ headline, customerStory, link, data }) {

  const { lang } = useContext(GlobalContext);
  const testemonials = get(data, 'properties.testemonials', []);

  const params = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSwiper, setImageSwiper] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const handleClickNext = () => imageSwiper?.slideNext();
  const handleClickPrev = () => imageSwiper?.slidePrev();

  const handleThumbSlideChange = ({ activeIndex }) => {
    setCurrentIndex(activeIndex);
    thumbsSwiper.slideTo(activeIndex);
  };

  const handleImageSlideChange = ({ activeIndex }) => {
    setCurrentIndex(activeIndex);
    imageSwiper.slideTo(activeIndex);
  };
  const filteredCustomerStory = React.useMemo(() => {
    if (isEmpty(testemonials)) {
      return customerStory;
    }

    const testimonialIds = testemonials.map((testimonial) => testimonial.id);
    return customerStory.filter((story) => testimonialIds.includes(story.id));
  }, [customerStory, testemonials]);
  const sortedCustomerStory = filteredCustomerStory.sort((a, b) => {
    const dateA = new Date(get(a, 'properties.date'));
    const dateB = new Date(get(b, 'properties.date'));
    return dateB - dateA;
  });

  sortedCustomerStory.sort((valueA) => {
    const slug = _.get(params, 'slug', []);
    const valueAModel = _.chain(valueA).get('properties.tractorModel', '').toLower().value();
    const valueASeries = _.chain(valueA).get('properties.series', '').kebabCase().value();
    const hasModelAndSeries = valueAModel && valueASeries;
    const hasValueA = _.some(
      slug,
      (val) => _.includes(val, valueASeries) || _.includes(val, valueAModel),
    );
    if (hasModelAndSeries && hasValueA) return -1;
    return 0;
  });

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

  return (
    <section id="success-stories" className="pt-10 lg:pt-[80px]">
      <BoxedContainer className="z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}>
          <SubtitleSection data={headline} className="tracking-[1px] md:tracking-[1.5px]" />
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
            {map(sortedCustomerStory, (item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="flex max-w-[675px] flex-col gap-4 pt-4 md:gap-6 md:pt-[26px]
                  lg:gap-8 lg:pt-[30px]">
                  <TitleSection data={get(item, 'properties.subtitle', '')} />
                  <p className="line-clamp-2 font-noto text-clamp14to18 leading-1.77">
                    {get(item, 'properties.description', '')}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
        {isEmpty(filteredCustomerStory) || (
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
                {filteredCustomerStory.length !== 1 &&
                  map(filteredCustomerStory, (item, index) => (
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
            {filteredCustomerStory.length !== 1 && (
              <SliderPrevNext
                slideCount={size(filteredCustomerStory)}
                handleClickPrev={handleClickPrev}
                handleClickNext={handleClickNext}
                imageSwiper={imageSwiper}
                currentIndex={currentIndex}
              />
            )}
          </motion.div>
        )}

        {isEmpty(link) ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}
            className="mb-6 pt-7 md:mb-0 lg:pt-[42px]">
            <Button
              label={lang === 'ko' ? '고객 스토리 보기' : 'SEE TYM’S CUSTOMER STORIES'}
              url={`/${lang}/products/success-stories`}
              text="sucess-stories-slider-button"
              variant="primaryMercury"
              className="inline-block w-[250px] lg:w-[353px]"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}
            className="mb-6 pt-7 md:mb-0 lg:pt-[42px]">
            <Button
              label={link[0].title}
              url={link[0].url}
              text="sucess-stories-slider-button"
              variant="primaryMercury"
              className="inline-block w-[250px] lg:w-[353px]"
            />
          </motion.div>
        )}
      </BoxedContainer>
      {isEmpty(filteredCustomerStory) || (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="relative z-10 mt-[-50px] lg:mt-[-150px]">
          <Image
            src={
              get(
                filteredCustomerStory,
                `[${currentIndex}].properties.featuredImage[0].url`,
                null,
              ) ||
              'https://tym-new.euwest01.umbraco.io/media/2tjhemkp/success-stories-placeholder.png'
            }
            alt={headline || 'image'}
            fill
            className="!relative h-auto w-full"
          />
        </motion.div>
      )}
    </section>
  );
}
