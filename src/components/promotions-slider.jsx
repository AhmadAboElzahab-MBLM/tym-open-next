import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { FreeMode, Thumbs, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { get, isEmpty, map } from 'lodash';
import Image from 'next/image';
import Loading from '@/components/layout/loading';
import Link from 'next/link';
import BoxedContainer from './layout/boxed-container';
import Button from './layout/button';
import SliderPrevNext from './layout/slider-prev-next';
import TitleSection from './layout/title-section';

export default function PromotionsSlider({ data, id, promotion, locale }) {
  const link = get(data, 'properties.link', null);
  const classname = get(data, 'properties.classname', null);
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

  const breakpointsthumb = {
    0: {
      slidesPerView: 4,
      spaceBetween: 8,
      slidesPerGroup: 1,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 8,
      slidesPerGroup: 1,
    },
  };

  const isMarkupValid = (markup) => markup !== '<p>[object Object]</p>';

  if (promotion.length > 0)
    return (
      <section id={id}>
        <BoxedContainer>
          {classname === 'innerpage' ? <div className="h-[1px] w-full bg-cherry" /> : ``}
          <div
            className={`pb-7 pt-7 ${
              classname === 'innerpage' ? 'lg:py-[60px]' : 'lg:pb-[60px] lg:pt-[80px]'
            }`}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}>
              <div className="h-full">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={0}
                  autoHeight
                  effect="fade"
                  fadeEffect={{
                    crossFade: true,
                  }}
                  thumbs={{
                    swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                  }}
                  modules={[FreeMode, Thumbs, EffectFade]}
                  onSwiper={setImageSwiper}
                  onSlideChange={handleThumbSlideChange}
                  className="mySwiper">
                  {_.map(promotion, (item, index) => (
                    <SwiperSlide key={index}>
                      <div className="flex h-[500px] max-h-[500px] min-h-[500px] flex-col bg-porcelain md:flex-row">
                        <div className="md:w-[50%]">
                          {isEmpty(get(item, 'properties.featuredImage', [])) || (
                            <Image
                              src={get(item, 'properties.featuredImage[0].url', '')}
                              alt={get(item, 'properties.title', '')}
                              fill
                              className="object-fit !relative"
                            />
                          )}
                        </div>
                        <div className="relative z-10 flex flex-col justify-center gap-y-4 p-5 md:w-[50%] md:p-[24px] lg:gap-y-[30px] lg:p-[60px] xl:gap-y-6 xl:p-[70px]">
                          <div className="flex flex-col gap-y-3 md:gap-y-4">
                            <div className="flex flex-col gap-y-3 lg:gap-y-4 xl:gap-y-5">
                              <h3 className="font-noto text-[12px] font-bold uppercase tracking-[0.50px] text-primary md:text-[15px] md:tracking-[1.50px]">
                                {get(item, 'properties.subtitle', '')}
                              </h3>
                              <TitleSection data={get(item, 'properties.title', '')} />
                            </div>
                            {item.properties.description && (
                              <div
                                className="font-noto text-clamp12to15 font-normal leading-[20px] text-primary md:leading-[24px]"
                                dangerouslySetInnerHTML={{
                                  __html: get(item, 'properties.description', ''),
                                }}
                              />
                            )}
                          </div>
                          {item.properties.promotionLink &&
                            item.properties.promotionLink.length > 0 && (
                              <Link
                                href={
                                  item.properties.promotionLink[0]?.url ||
                                  item.properties.promotionLink[0].route?.path
                                    .replace('/en/', `/${locale.toLowerCase()}/`)
                                    .replace('/en-us/', `/${locale.toLowerCase()}/`)
                                    .replace('/ko/', `/${locale.toLowerCase()}/`)
                                    .replace('/en-ko/', `/${locale.toLowerCase()}/`) ||
                                  ''
                                }
                                target={item.properties.promotionLink[0]?.target}
                                className="promotions-slider-button disabled: inline-flex min-h-[40px] w-[250px] cursor-pointer items-center justify-center whitespace-pre border border-none bg-white px-[32px] py-[12px] text-clamp12to15 font-bold uppercase not-italic leading-1.625 text-primary transition-all duration-300 ease-in-out hover:!border hover:!border-b-white hover:!bg-mercury hover:text-primary disabled:opacity-10 md:px-[60px] md:py-[10px] lg:min-h-[45px] lg:px-[85px] xl:min-h-[64px]">
                                {item.properties.promotionLink[0].title}
                              </Link>
                            )}
                          {_.isEmpty(item.properties.pageContent) ||
                            !isMarkupValid(item.properties.pageContent) || (
                              <div
                                className="font-noto text-[10px] font-normal leading-[1.4] text-primary lg:text-[11px]"
                                dangerouslySetInnerHTML={{
                                  __html: item.properties.pageContent.markup,
                                }}
                              />
                            )}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </motion.div>

            {promotion.length > 1 ? (
              <div className="relative flex justify-between pt-4 md:pt-7">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="flex h-fit flex-row items-center gap-x-5 md:gap-x-8">
                  <div>
                    <Swiper
                      breakpoints={breakpointsthumb}
                      hashNavigation={{
                        watchState: true,
                      }}
                      onSwiper={setThumbsSwiper}
                      onSlideChange={handleImageSlideChange}
                      className="swiper-slide:relative swiper-slide:cursor-pointer swiper-slide-thumb-active:!opacity-100 swiper-wrapper:w-[60px]">
                      {map(promotion, (item, index) => (
                        <SwiperSlide key={index}>
                          <p className="font-noto text-[15px] font-bold uppercase leading-[24px] text-primary opacity-25">
                            {index + 1}
                          </p>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <SliderPrevNext
                    slideCount={promotion?.length}
                    handleClickPrev={handleClickPrev}
                    handleClickNext={handleClickNext}
                    imageSwiper={imageSwiper}
                    currentIndex={currentIndex}
                  />
                </motion.div>
              </div>
            ) : (
              ''
            )}
          </div>
          {classname === 'innerpage' ? <div className="h-[1px] w-full bg-cherry" /> : ``}
        </BoxedContainer>
      </section>
    );
}
