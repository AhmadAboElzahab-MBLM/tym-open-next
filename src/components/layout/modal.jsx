import React from 'react';
import ReactModal from 'react-modal';
import BodyLock from '@/components/layout/body-lock';

function Modal({ children, handleClose, className, isOpen = true }) {
  return (
    isOpen && (
      <>
        <BodyLock />
        <ReactModal
          isOpen={isOpen}
          onRequestClose={handleClose}
          shouldCloseOnEsc
          shouldCloseOnOverlayClick
          shouldFocusAfterRender
          ariaHideApp={false}
          className={`${className} fixed inset-0 flex h-auto items-center justify-center outline-none xl:max-w-[70rem] max-w-[96%]`}
          overlayClassName="fixed top-0 left-0 z-[100] inset-0 bg-primary bg-opacity-20
          !outline-none !border-[transparent] !border-0 !appearance-none overflow-x-hidden"
          style={{
            content: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              border: '1px solid #cccccc',
              background: 'white',
              WebkitOverflowScrolling: 'touch',
              borderRadius: '0.25rem',
              outline: 'none',
              maxHeight: '100vh', // Prevent modal from being taller than the viewport
              // maxWidth: '70rem', // Full width up to a certain point
              width: '100%', // Full width
            },
          }}>
          <div className="w-full max-h-[90vh] mobile-container-adjustment">{children}</div>
        </ReactModal>
      </>
    )
  );
}

export default Modal;
