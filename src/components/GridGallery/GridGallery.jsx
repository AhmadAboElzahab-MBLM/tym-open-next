import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import _ from 'lodash';
import Icons from '../layout/icons';
import ImageModal from '../layout/image-modal';
import BoxedContainer from '../layout/boxed-container';
import Image from 'next/image';
import Button from '../layout/button';

export default function GridGallery({ data, initialItemsCount = 3 }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Extract gallery data from the provided structure
  const galleryData = _.get(data, 'properties.gallery.items', []);
  const title = _.get(data, 'properties.title', '');
  const subtitle = _.get(data, 'properties.subtitle', '');

  // Determine which items to show
  const itemsToShow = showAll ? galleryData : galleryData.slice(0, initialItemsCount);
  const hasMoreItems = galleryData.length > initialItemsCount;

  const openModal = (imageData) => {
    setSelectedImage(imageData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const toggleShowMore = () => {
    setShowAll(!showAll);
  };

  if (_.isEmpty(galleryData)) {
    return <div>No gallery items available</div>;
  }

  // Animation variants for show more functionality only
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="mx-auto mt-15 text-primary lg:mt-20">
      <BoxedContainer>
        {!_.isEmpty(title) && (
          <h2 className="mb-8 text-center text-clamp18to28 font-bold">{title}</h2>
        )}

        {!_.isEmpty(subtitle) && (
          <p
            className="mb-4 text-center text-clamp16to18 lg:mb-16"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {itemsToShow.map((item, index) => {
              const itemContent = _.get(item, 'content', {});
              const itemProperties = _.get(itemContent, 'properties', {});
              const itemImage = _.get(itemProperties, 'icon[0]', null);
              const label = _.get(itemProperties, 'label', '');

              if (_.isEmpty(itemImage)) {
                return null;
              }

              const isExtraItem = index >= initialItemsCount;

              return (
                <motion.div
                  key={itemContent.id || index}
                  className="group relative overflow-hidden bg-white duration-300"
                  variants={isExtraItem ? itemVariants : {}}
                  initial={isExtraItem ? 'hidden' : false}
                  animate={isExtraItem ? 'visible' : false}
                  exit={isExtraItem ? 'hidden' : false}
                  layout>
                  {label && (
                    <div className="">
                      <h3 className="mb-2 text-clamp16to18 font-[400]">{label}</h3>
                    </div>
                  )}
                  <div className="relative aspect-video">
                    {/* Fullscreen Button */}
                    <button
                      type="button"
                      onClick={() => openModal(itemImage.url)}
                      className="feature-gallery-fullscreen absolute right-5 top-5 z-[5] cursor-pointer bg-[#333] p-[4px]">
                      <Icons name="Fullscreen" className="relative" />
                    </button>

                    {/* Image */}
                    <Image
                      src={`${itemImage.url}?width=560&height=315&mode=crop`}
                      alt={itemImage.name || label}
                      className="h-full w-full object-cover"
                      width={560}
                      height={315}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {hasMoreItems && !showAll && (
          <div className="mx-auto mt-8 w-fit lg:mt-15">
            <Button clickHandler={toggleShowMore} variant="primaryJD" label={'옵션 더 보기'} />
          </div>
        )}
      </BoxedContainer>

      {/* Image Modal */}
      <ImageModal isOpen={isModalOpen} imageData={selectedImage} handleCloseModal={closeModal} />
    </div>
  );
}
