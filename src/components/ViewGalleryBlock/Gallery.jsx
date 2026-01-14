import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import { Grid, Navigation } from 'swiper/modules';
import Image from 'next/image';

import Arrow from '../../assets/svg/arrow.svg';
import ImageModal from '../layout/image-modal';

export default function Gallery({ images, isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState(images);
  const [nextImages, setNextImages] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (JSON.stringify(images) !== JSON.stringify(currentImages)) {
      setIsTransitioning(true);
      setNextImages(images);

      setTimeout(() => {
        setCurrentImages(images);
        setNextImages(null);
        setIsTransitioning(false);
      }, 300);
    }
  }, [images, currentImages]);

  const closeModal = () => {
    if (selectedImage && isOpen) {
      setIsOpen(false);
      setSelectedImage(null);
      setSelectedImageIndex(0);
    }
  };

  const handleNextImage = () => {
    const nextIndex = (selectedImageIndex + 1) % currentImages.length;
    setSelectedImageIndex(nextIndex);
    setSelectedImage(currentImages[nextIndex]);
  };

  const handlePreviousImage = () => {
    const prevIndex = (selectedImageIndex - 1 + currentImages.length) % currentImages.length;
    setSelectedImageIndex(prevIndex);
    setSelectedImage(currentImages[prevIndex]);
  };

  const galleryStyle = {
    opacity: isTransitioning ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
  };

  if (isMobile) {
    return (
      <>
        <div style={galleryStyle} className="relative mx-auto flex h-full w-full items-center">
          <div className="swiper-button-prev-custom-mobile z-10 flex cursor-pointer items-center justify-center p-2">
            <Arrow />
          </div>

          <Swiper
            key={`mobile-${JSON.stringify(currentImages)}`}
            slidesPerView={2}
            spaceBetween={12}
            loop
            direction="horizontal"
            centeredSlides={false}
            allowTouchMove
            navigation={{
              nextEl: '.swiper-button-next-custom-mobile',
              prevEl: '.swiper-button-prev-custom-mobile',
            }}
            modules={[Navigation]}
            className="mx-4 w-full"
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}>
            {currentImages.map((image, index) => (
              <SwiperSlide
                key={`mobile-${index}`}
                className="!h-[100px] cursor-pointer"
                onClick={() => {
                  setSelectedImage(image);
                  setSelectedImageIndex(index);
                  setIsOpen(true);
                }}>
                <div className="relative h-full w-full select-none overflow-hidden">
                  <Image
                    fill
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="object-cover transition-transform duration-200 hover:scale-105"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-button-next-custom-mobile z-10 flex cursor-pointer items-center justify-center p-2">
            <Arrow className="rotate-180" />
          </div>
        </div>

        <ImageModal
          isOpen={isOpen}
          imageData={selectedImage}
          handleCloseModal={closeModal}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
          hasNext={selectedImageIndex < currentImages.length - 1}
          hasPrevious={selectedImageIndex > 0}
        />
      </>
    );
  }

  // Desktop Vertical Layout (Original)
  return (
    <>
      <div
        style={galleryStyle}
        className="relative mx-auto flex h-full w-full flex-col items-center justify-between">
        <div className="swiper-button-prev-custom flex cursor-pointer items-center justify-center">
          <Arrow className="rotate-90" />
        </div>

        <Swiper
          key={JSON.stringify(currentImages)}
          slidesPerView={5}
          grid={{
            rows: 1,
          }}
          loop
          direction="vertical"
          spaceBetween={12}
          centeredSlides={false}
          allowTouchMove={false}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          modules={[Navigation, Grid]}
          className="w-full"
          style={{
            '--swiper-slide-padding': '0px',
            height: `${5 * 102 + 4 * 12}px`,
          }}>
          {currentImages.map((image, index) => (
            <SwiperSlide
              key={index}
              className="!h-[102px] cursor-pointer"
              style={{
                padding: '0',
                margin: '0',
                display: 'flex',
              }}
              onClick={() => {
                setSelectedImage(image);
                setSelectedImageIndex(index);
                setIsOpen(true);
              }}>
              <div className="relative h-full w-full select-none overflow-hidden">
                <Image
                  fill
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-button-next-custom flex cursor-pointer items-center justify-center">
          <Arrow className="-rotate-90" />
        </div>
      </div>

      <ImageModal
        isOpen={isOpen}
        imageData={selectedImage}
        handleCloseModal={closeModal}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
        hasNext={selectedImageIndex < currentImages.length - 1}
        hasPrevious={selectedImageIndex > 0}
      />
    </>
  );
}
