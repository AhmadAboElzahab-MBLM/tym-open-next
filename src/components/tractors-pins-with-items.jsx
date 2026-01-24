import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import 'swiper/css';
import React, { useState, useContext } from 'react';
import GlobalContext from '@/context/global-context';
import { motion } from 'framer-motion';
import Icons from '@/components/layout/icons';
import _ from 'lodash';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';
import ImageModal from './layout/image-modal';

export default function TractorsPinsWithItems({ data, id }) {
  const title = _.get(data, 'properties.featuresTitle.markup', '');
  const text = _.get(data, 'properties.featuresText.markup', '');
  const features = _.get(data, 'properties.features.items', []);
  const images = _.get(data, 'properties.threeSixtyImages', []);
  const isMarkupValid = (markup) => markup !== '<p>[object Object]</p>';
  const { translations, lang } = useContext(GlobalContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [swiper, setSwiper] = useState(null);
  const [currIndex, setCurrIndex] = useState(0);

  if (_.isEmpty(features)) return null;

  const handleNext = () => {
    if (swiper) {
      swiper.slideTo(currIndex < images.length - 1 ? currIndex + 1 : 0);
    }
  };

  const handlePrev = () => {
    if (swiper) {
      swiper.slideTo(currIndex > 0 ? currIndex - 1 : images.length - 1);
    }
  };

  const handleModalOpen = (imageData) => {
    setSelectedImage(imageData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <section id={id}>
        <BoxedContainer>
          <div className="h-[1px] w-full bg-cherry" />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col gap-y-4 pb-10 pt-10 lg:gap-y-[62px] lg:pb-[92px] lg:pt-20">
            <div className="flex flex-col items-center gap-y-3 text-center lg:gap-y-[32px]">
              {_.isEmpty(title) || !isMarkupValid(title) || (
                <TitleSection data={title} className="max-w-[480px]" />
              )}
              {_.isEmpty(text) || !isMarkupValid(text) || (
                <div
                  className="max-w-[800px] font-noto text-clamp14to18 font-normal leading-1.77 text-[#000]"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              )}
            </div>
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
                    onSlideChange={(_swiper) => setCurrIndex(_swiper.activeIndex)}
                    className="relative">
                    {_.map(images, (image, index) => (
                      <SwiperSlide key={index}>
                        <div className="flex w-full items-center justify-center">
                          {_.isEmpty(image) || (
                            <Image
                              src={image.url}
                              alt="Rotate Image"
                              width={967}
                              height={916}
                              className="!relative h-full md:w-[70%]"
                            />
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                    {_.isEmpty(images) || (
                      <div className="absolute top-1/2 z-10 flex w-full flex-row justify-between gap-x-[30px]">
                        <button
                          type="button"
                          onClick={handlePrev}
                          className={`tractors-pin-prev-button h-[40px] w-[15px] svg-child-path:stroke-black md:w-[20px] ${currIndex === 0 ? 'opacity-50' : 'opacity-100'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 40" fill="none">
                            <path d="M21 38L3 20L21 2" stroke="#1A1A1A" strokeWidth="3" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className={`tractors-pin-next-button h-[40px] w-[15px] svg-child-path:stroke-black md:w-[20px] ${currIndex === images.length - 1 ? 'opacity-50' : 'opacity-100'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 40" fill="none">
                            <path d="M2 2L20 20L2 38" stroke="#1A1A1A" strokeWidth="3" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </Swiper>
                </div>
              </div>
              <div className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 md:gap-[30px]">
                {_.map(features, (item, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between gap-y-3 md:gap-y-[15px]">
                    <span className="font-noto text-[16px] font-normal leading-[22px] text-primary lg:text-[18px] lg:leading-[28px]">
                      {item.content.properties.title}
                    </span>
                    <div className="relative text-center">
                      {_.isEmpty(item.content.properties.image) || (
                        <Image
                          src={_.get(item, 'content.properties.image[0].url', '')}
                          alt={item.content.properties.title}
                          width={355}
                          height={152}
                          className="!max-h-38 w-full object-cover"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => handleModalOpen(item.content.properties.modalImage[0].url)}
                        className="absolute right-[15px] top-[15px] bg-[#333] p-[4px]">
                        <Icons name="Fullscreen" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          <div className="h-[1px] w-full bg-cherry" />
        </BoxedContainer>
      </section>
      <ImageModal isOpen={isModalOpen} imageData={selectedImage} handleCloseModal={closeModal} />
    </>
  );
}
