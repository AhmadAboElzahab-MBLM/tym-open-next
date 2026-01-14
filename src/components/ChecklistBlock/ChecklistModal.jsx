import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BoxedContainer from '../layout/boxed-container';
import GeneratedTable from '../GeneratedTable/GeneratedTable';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import Icons from '../layout/icons';
import BodyLock from '../layout/body-lock';

const ChecklistModal = ({
  isOpen,
  onClose,
  groupedData,
  warrantyTable,
  checklistSubtitle,
  checklistTitle,
  warrantyTitle,
  conditionTitle,
  conditionTable,
  historySubtitle,
  historyTable,
  historyTitle,
  caption,
  illustration,
  modalSubtitle,
  modalTitle,
  infoTitle,
  infoTable,
}) => {
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    if (isOpen && groupedData) {
      const initialOpenState = {};
      Object.keys(groupedData).forEach((category) => {
        initialOpenState[category] = false;
      });
      setOpenSections(initialOpenState);
    }
  }, [isOpen, groupedData]);

  const toggleSection = (category) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleBackdropClick = () => {
    onClose();
  };

  const categories = groupedData ? Object.keys(groupedData) : [];

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <BodyLock />

          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50"
            onClick={handleBackdropClick}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          />

          {/* Modal Content Container */}
          <div className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center">
            <motion.div
              className="pointer-events-auto w-full max-w-6xl overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit">
              <BoxedContainer className="h-screen overflow-hidden bg-white lg:h-full lg:w-auto">
                {/* Header - Sticky */}
                <div className="sticky top-0 z-10 bg-white">
                  <div className="relative px-6 py-6 lg:px-11 lg:py-20">
                    <button
                      onClick={onClose}
                      className="my-10 mb-5 w-full p-2 transition-colors lg:absolute lg:right-11 lg:my-0 lg:mb-0 lg:block lg:w-fit"
                      aria-label="Close modal">
                      <Icons name={'Close2'} className={'ml-auto'} />
                    </button>
                    <div>
                      {!isEmpty(modalTitle) && (
                        <h2 className="mb-4 text-center text-clamp18to28 font-bold">
                          {modalTitle}
                        </h2>
                      )}

                      {!isEmpty(modalSubtitle) && (
                        <p
                          className="text-center text-clamp16to18"
                          dangerouslySetInnerHTML={{ __html: modalSubtitle }}
                        />
                      )}
                    </div>

                    {/* Close Button */}
                  </div>
                </div>

                {/* Scrollable Content */}
                <div
                  className="overflow-y-auto px-6 py-6 lg:px-11"
                  style={{ maxHeight: 'calc(90vh - 120px)' }}>
                  {/* Warranty Section */}
                  <div className="mb-12">
                    {!isEmpty(infoTitle) && (
                      <h2 className="mb-6 text-left text-clamp18to28 font-bold">{infoTitle}</h2>
                    )}
                    {!isEmpty(infoTable) && <GeneratedTable table={infoTable} />}
                  </div>

                  {/* Condition Section */}
                  <div className="mb-12">
                    {!isEmpty(conditionTitle) && (
                      <h2 className="mb-6 text-left text-clamp18to28 font-bold">
                        {conditionTitle}
                      </h2>
                    )}
                    {!isEmpty(conditionTable) && <GeneratedTable table={conditionTable} />}
                  </div>

                  {/* History Section */}
                  <div className="mb-12">
                    {!isEmpty(historyTitle) && (
                      <h2 className="mb-6 text-left text-clamp18to28 font-bold">{historyTitle}</h2>
                    )}
                    {!isEmpty(historySubtitle) && (
                      <p
                        className="mb-6 text-left text-clamp16to18"
                        dangerouslySetInnerHTML={{ __html: historySubtitle }}
                      />
                    )}
                    {!isEmpty(illustration) && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}${illustration}`}
                        alt={historyTitle}
                        width={800}
                        height={500}
                        className="mb-12 object-cover"
                      />
                    )}
                    {!isEmpty(historyTable) && <GeneratedTable table={historyTable} />}
                    {!isEmpty(caption) && (
                      <p className="mt-4 text-left text-clamp16to18 text-gray-600">{caption}</p>
                    )}
                  </div>

                  {/* Checklist Section */}
                  {categories.length > 0 && (
                    <div className="mt-20 border-t border-JDGreen pt-20">
                      {!isEmpty(checklistTitle) && (
                        <h2 className="mb-4 text-center text-clamp18to28 font-bold">
                          {checklistTitle}
                        </h2>
                      )}

                      {!isEmpty(checklistSubtitle) && (
                        <p className="mb-8 text-center text-clamp16to18">{checklistSubtitle}</p>
                      )}

                      <div className="mb-50 lg:mb-20">
                        {categories.map((category) => (
                          <CategorySection
                            key={category}
                            category={category}
                            items={groupedData[category]}
                            isOpen={openSections[category]}
                            onToggle={() => toggleSection(category)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </BoxedContainer>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const CategorySection = ({ category, categoryIndex, items, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className={classNames(
          isOpen ? 'bg-JDGreen' : 'bg-primary',
          'flex w-full items-center justify-between bg-JDGreen px-4 py-2 text-left transition-colors duration-150',
        )}>
        <div className="flex items-center space-x-3">
          <h4 className="text-[15px] font-medium text-white">{category}</h4>
        </div>
        <svg
          className={`h-5 w-5 text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180 transform' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-porcelain text-[15px] font-bold text-primary">
                  <th className="w-23 border-[1px] border-grey px-6 py-4 text-left">NO.</th>
                  <th className="border-[1px] border-grey px-6 py-4 text-left">점검항목</th>
                  <th className="w-44.5 border-[1px] border-grey px-6 py-4 text-left">검사 결과</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, itemIndex) => (
                  <tr key={itemIndex}>
                    <td className="w-23 border-[1px] border-grey px-6 py-3 text-left">{item.no}</td>
                    <td className="border-[1px] border-grey px-6 py-3 text-left">{item.item}</td>
                    <td className="w-44.5 border-[1px] border-grey px-6 py-3 text-left">
                      <span>{item.result}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistModal;
