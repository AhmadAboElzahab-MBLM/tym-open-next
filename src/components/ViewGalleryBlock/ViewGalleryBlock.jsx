import React, { useRef, useState } from 'react';
import { get } from 'lodash';
import { AnimatePresence } from 'framer-motion';

import BoxedContainer from '../layout/boxed-container';
import Toggles from './Toggles'; // Your existing component
import Controls from './Controls';
import Viewer from './Viewer'; // New separated component
import Gallery from './Gallery';
import FullScreenView from './FullScreenView';

const getImages = (images) =>
  images.map((image) => `${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}${image.url}`);

export default function ViewGalleryBlock({ data, id }) {
  const secondLabel = get(data, 'properties.secondLabel', '');
  const firstLabel = get(data, 'properties.firstLabel', '');
  const interiorGallery = get(data, 'properties.interiorGallery', '');
  const exteriorGallery = get(data, 'properties.exteriorGallery', '');
  const threeSixtyViewGallery = get(data, 'properties.threeSixtyViewGallery', '');

  const tridiRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fullScreen, setFullScreen] = useState(false);
  const [selected, setSelected] = useState(firstLabel);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const threeSixtyViewGalleryImages = getImages(threeSixtyViewGallery);
  const interiorGalleryImages = getImages(interiorGallery);
  const exteriorGalleryImages = getImages(exteriorGallery);

  // Callback to handle image changes from the viewer
  const handleImageChange = (newIndex) => {
    setCurrentImageIndex(newIndex);
  };

  const zoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.5, 3);
    setZoomLevel(newZoom);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
  };

  return (
    <section
      id={id}
      className={`bg-white py-15 font-noto text-clamp12to15 leading-[24px] text-primary lg:py-15`}>
      <BoxedContainer>
        <div className="">
          <div className="flex flex-col">
            {/* Mobile Layout */}
            <div className="flex flex-col md:hidden">
              {/* Toggles - using your existing component */}
              <div className="mx-auto mb-6 w-fit">
                <Toggles
                  variant="compact"
                  firstLabel={firstLabel}
                  secondLabel={secondLabel}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>

              {/* 360 Viewer - now separated */}
              <div className="relative mb-6">
                <div className="h-[300px] w-full">
                  <Viewer
                    ref={tridiRef}
                    zoomLevel={zoomLevel}
                    images={threeSixtyViewGalleryImages}
                    touchDragInterval={5.5}
                    dragInterval={5.5}
                    onImageChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="mb-6">
                <Controls
                  zoomIn={zoomIn}
                  zoomOut={zoomOut}
                  zoomLevel={zoomLevel}
                  tridiRef={tridiRef}
                  isFullScreen={fullScreen}
                  setFullScreen={setFullScreen}
                />
              </div>

              {/* Horizontal Gallery */}
              <div className="h-[120px] w-full">
                <Gallery
                  images={selected === firstLabel ? interiorGalleryImages : exteriorGalleryImages}
                  isMobile
                />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex md:!h-[635px] md:w-full md:flex-row md:gap-x-8">
              <div className="relative flex flex-row gap-x-8">
                <div className="absolute left-0 top-0 z-40">
                  <Toggles
                    firstLabel={firstLabel}
                    secondLabel={secondLabel}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </div>
                <div className="w-40 flex-shrink-0" />
                <Viewer
                  ref={tridiRef}
                  zoomLevel={zoomLevel}
                  images={threeSixtyViewGalleryImages}
                  touchDragInterval={5.5}
                  dragInterval={5.5}
                  onImageChange={handleImageChange}
                />
              </div>
              <div className="h-[635px] w-40 flex-shrink-0">
                <Gallery
                  images={selected === firstLabel ? interiorGalleryImages : exteriorGalleryImages}
                  isMobile={false}
                />
              </div>
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:block">
              <Controls
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                zoomLevel={zoomLevel}
                tridiRef={tridiRef}
                isFullScreen={fullScreen}
                setFullScreen={setFullScreen}
              />
            </div>
          </div>
        </div>
      </BoxedContainer>

      <AnimatePresence>
        {fullScreen && (
          <FullScreenView
            tridiRef={tridiRef}
            zoomLevel={zoomLevel}
            images={threeSixtyViewGalleryImages}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            isFullScreen={fullScreen}
            setFullScreen={setFullScreen}
            touchDragInterval={5.5}
            dragInterval={5.5}
            onImageChange={handleImageChange}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
