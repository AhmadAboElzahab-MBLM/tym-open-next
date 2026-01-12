import React from 'react';
import { motion } from 'framer-motion';
import BodyLock from '../layout/body-lock';
import Viewer from './Viewer';
import Controls from './Controls';

export default function FullScreenView({
  tridiRef,
  zoomLevel,
  images,
  zoomIn,
  zoomOut,
  isFullScreen,
  setFullScreen,
  touchDragInterval = 5.5,
  dragInterval = 5.5,
  onImageChange,
}) {
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setFullScreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setFullScreen]);

  const fullScreenVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <div>
      <BodyLock />
      <motion.div
        className="fixed inset-0 z-50 flex h-screen w-screen flex-col bg-white"
        variants={fullScreenVariants}
        initial="hidden"
        animate="visible"
        exit="exit">
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden">
          <div className="mx-auto h-fit w-1/2">
            <Viewer
              ref={tridiRef}
              zoomLevel={zoomLevel}
              images={images}
              touchDragInterval={touchDragInterval}
              dragInterval={dragInterval}
              onImageChange={onImageChange}
            />
          </div>
        </div>

        <div className="flex-shrink-0 px-6 py-4">
          <Controls
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            zoomLevel={zoomLevel}
            tridiRef={tridiRef}
            isFullScreen={isFullScreen}
            setFullScreen={setFullScreen}
          />
        </div>

        <button
          type="button"
          className="z-60 absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-black bg-opacity-70 text-3xl font-bold text-white transition-all hover:bg-opacity-90 hover:text-gray-300"
          onClick={() => setFullScreen(false)}>
          ×
        </button>
      </motion.div>
    </div>
  );
}
