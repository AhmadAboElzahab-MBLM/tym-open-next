import React, { useContext, useEffect, useState } from 'react';
import Modal from '@/components/layout/modal';
import Icons from '@/components/layout/icons';
import _ from 'lodash';
import QuizItem from '@/components/quiz/quiz-item';
import GlobalContext from '@/context/global-context';

function Quiz({ data }) {
  const items = data?.properties?.items?.items || [];
  const title = data?.properties?.title || '';
  const text = data?.properties?.text?.markup || '';
  const nextLabel = data?.properties?.nextLabel || 'Next';
  const prevLabel = data?.properties?.prevLabel || 'Previous';
  const restartLabel = data?.properties?.restartLabel || 'Restart';

  const [isOpen, setIsOpen] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [selected, setSelected] = useState({});

  const {pickMyTractor, setPickMyTractor } = useContext(GlobalContext);

  const lastIndex = items.length - 1;

  const handleOpen = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleNext = () => setCurrIndex((prev) => (prev < lastIndex ? prev + 1 : prev));
  const handlePrev = () => setCurrIndex((prev) => (prev > 0 ? prev - 1 : prev));

  const handleClear = () => {
    setSelected({});

    if (setPickMyTractor) {
      setPickMyTractor({});
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (setPickMyTractor) {
      setPickMyTractor(selected);
    }
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      handleClear();
      setCurrIndex(0);
      setShowSubmit(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const queryString = window.location.search;
    if (queryString.includes('?p=quiz')) {
      setIsOpen(true);
    }

    const pickTractorEl = document.querySelector('#pick-my-tractor-btn');
    if (pickTractorEl) pickTractorEl.addEventListener('click', handleOpen);

    return () => {
      if (pickTractorEl) pickTractorEl.removeEventListener('click', handleOpen);
    };
  }, []);

  useEffect(() => {
    const totalItems = items.length;
    const currItems = _.filter(Object.values(selected), (val) => val !== '');
    const currLength = currItems?.length || 0;
    setShowSubmit(_.isEqual(currLength, totalItems));
  }, [items.length, selected]);

  return (
    isOpen && (
      <Modal handleClose={handleClose} isOpen={isOpen}>
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex max-h-[9.25rem] w-full justify-between bg-cherry p-12">
            <div className="flex flex-col gap-3">
              <span
                className="font-noto text-clamp14to15 font-bold uppercase leading-1.5 tracking-wider
                text-white">
                {title}
              </span>
              {_.isEmpty(text) || (
                <div
                  className="font-noto text-clamp14to15 leading-1.5 tracking-wider text-white"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              )}
            </div>
            <button type="button" onClick={handleClose}>
              <Icons name="Close" className="svg-child-path:!stroke-white" />
            </button>
          </div>
          <div
            className="flex w-full flex-wrap gap-8 !overflow-y-auto px-10 py-12 md:gap-12 lg:gap-16
            xl:gap-x-20 2xl:gap-x-24 3xl:gap-x-28 4xl:gap-x-32">
            <QuizItem item={items[currIndex]} selected={selected} setSelected={setSelected} />
          </div>
          <div className="flex w-full gap-x-12 px-10 pb-16 pt-4">
            {showSubmit ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="mx-auto whitespace-pre border-none bg-cherry px-10
                py-5 text-clamp14to15 font-bold uppercase leading-1.625 text-white hover:bg-paprika hover:text-white">
                Submit
              </button>
            ) : (
              <div className="flex gap-x-12">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currIndex === 0}
                  className="quiz-prev-button whitespace-pre border-none bg-cherry px-10
                  py-5 text-clamp14to15 font-bold uppercase leading-1.625 text-white hover:bg-paprika
                  hover:text-white disabled:cursor-not-allowed disabled:bg-dawn">
                  {prevLabel}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currIndex === lastIndex}
                  className="quiz-next-button whitespace-pre border-none bg-cherry px-10
                  py-5 text-clamp14to15 font-bold uppercase leading-1.625 text-white hover:bg-paprika
                  hover:text-white disabled:cursor-not-allowed disabled:bg-dawn">
                  {nextLabel}
                </button>
                <button
                  type="button"
                  className="quiz-restart-button px-4 font-noto text-clamp14to15 font-bold underline"
                  onClick={handleClear}>
                  {restartLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    )
  );
}

export default Quiz;

