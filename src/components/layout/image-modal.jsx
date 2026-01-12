import Image from 'next/image';
import React from 'react';
import _ from 'lodash';
import ReactModal from 'react-modal';
import BodyLock from '@/components/layout/body-lock';
import Icons from './icons';
import ModalNavigationArrows from '../ViewGalleryBlock/ModalNavigationArrows';

export default function ImageModal({ isOpen, handleCloseModal, imageData, onNext, onPrevious, hasNext, hasPrevious }) {
  return (
    isOpen && (
      <>
        <BodyLock />
        <ReactModal
          isOpen={isOpen}
          onRequestClose={handleCloseModal}
          shouldCloseOnEsc
          shouldCloseOnOverlayClick
          shouldFocusAfterRender
          className="lg2:min-w-[69rem] fixed bottom-auto left-1/2 right-auto top-1/2 flex
          max-h-[420px] w-[95%] max-w-[36rem] -translate-x-1/2 -translate-y-1/2 appearance-none
          flex-col items-center justify-center overflow-hidden 
          rounded-[0.25rem] border-0 border-[transparent]
          bg-white outline-none md:w-[80%] lg:min-h-[26rem] lg:min-w-[60rem]"
          overlayClassName="fixed top-0 left-0 z-[100] inset-0 bg-primary bg-opacity-50 outline-none
          border-[transparent] border-0 appearance-none">
          <div className="absolute right-2 top-2 sm:right-6 sm:top-6">
            <button
              type="button"
              className="relative z-[15] flex h-[30px] w-[30px] cursor-pointer items-center
              justify-center bg-white"
              onClick={handleCloseModal}>
              <Icons name="Close" className="svg-path:fill-primary" />
            </button>
          </div>

          <ModalNavigationArrows
            onNext={onNext}
            onPrevious={onPrevious}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
          />

          {_.isEmpty(imageData) || (
            <Image
              src={imageData}
              alt="image"
              fill
              draggable="false"
              className="!relative max-h-full !w-full max-w-full !object-contain"
            />
          )}
        </ReactModal>
      </>
    )
  );
}
