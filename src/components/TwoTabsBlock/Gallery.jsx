import React, { useState } from 'react';
import _ from 'lodash';
import Image from 'next/image';
import { motion } from 'framer-motion';
import BoxedContainer from '../layout/boxed-container';
import Icons from '../layout/icons';
import ImageModal from '../layout/image-modal';

export default function Gallery({ data }) {
  const uspItems = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  if (_.isEmpty(uspItems)) return null;
  const openModal = (imageData) => {
    setSelectedImage(imageData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };
  if (!data) {
    return null;
  }
  return (
    <>
      <section id="featured_gallery" className="bg-white">
        <BoxedContainer>
          <div className="flex flex-col gap-y-[30px] md:gap-y-[40px] lg:gap-y-[80px]">
            {_.isNil(uspItems) || (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col gap-y-[15px] md:gap-y-0">
                {_.map(uspItems.items, (item, index) => {
                  const itemTitle = _.get(item, 'content.properties.title.markup', '');
                  const itemText = _.get(item, 'content.properties.text.markup', '');
                  const itemImage = _.get(item, 'content.properties.image[0]', null);
                  return (
                    <div
                      key={index}
                      className="flex min-h-[240px] flex-col-reverse justify-between border border-grey last:border-b last:border-b-grey md:flex-row md:border-b-[0px] md:border-l md:border-t md:border-[auto] md:border-b-[transparent] md:border-b-grey md:border-l-grey md:border-r-grey md:border-t-grey">
                      <div className="flex flex-col gap-y-2 py-[20px] pl-[20px] pr-[20px] md:w-[560px] lg:gap-y-[20px] lg:py-[40px] lg:pl-[40px] lg:pr-[70px]">
                        {_.isEmpty(itemTitle) || (
                          <div
                            className="text-center font-noto text-clamp16to18 font-bold leading-1.625 text-primary md:text-left"
                            dangerouslySetInnerHTML={{ __html: itemTitle }}
                          />
                        )}
                        {_.isEmpty(itemText) || (
                          <div
                            className="flex flex-col gap-y-2.5 text-center font-noto text-clamp12to15 font-normal leading-1.625 text-primary md:text-left lg:gap-y-5"
                            dangerouslySetInnerHTML={{ __html: itemText }}
                          />
                        )}
                      </div>
                      <div className="relative w-full border-l border-grey md:w-[560px]">
                        {_.isEmpty(itemImage) || (
                          <>
                            <button
                              type="button"
                              onClick={() => openModal(itemImage.url)}
                              className="feature-gallery-fullscreen absolute right-5 top-5 z-[5] cursor-pointer bg-[#333] p-[4px]">
                              <Icons name="Fullscreen" className="relative" />
                            </button>
                            <Image
                              src={`${itemImage.url}?width=560&height=240&mode=crop`}
                              width={560}
                              height={240}
                              alt={itemImage.name}
                              className="!relative h-full w-full object-cover"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </BoxedContainer>
      </section>
      <ImageModal isOpen={isModalOpen} imageData={selectedImage} handleCloseModal={closeModal} />
    </>
  );
}
