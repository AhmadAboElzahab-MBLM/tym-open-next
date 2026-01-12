import React, { useContext } from 'react';
import Modal from '@/components/layout/modal';
import Icons from '@/components/layout/icons';
import _ from 'lodash';
import Button from '@/components/layout/button';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

function FilterModal({
  items,
  handleClose,
  selectedFilters,
  handleFilterSelect,
  handleClearFilters,
  applyFilter,
  isOpen,
}) {
  const { translations, lang } = useContext(GlobalContext);

  return (
    <Modal handleClose={handleClose} isOpen={isOpen}>
      <div
        className="flex h-screen w-full flex-col items-center justify-center overflow-y-auto
        md:h-auto">
        <div className="flex max-h-[6.75rem] w-full justify-between border-b border-grey p-10">
          <span
            className="font-noto text-clamp14to15 font-bold uppercase leading-1.5 tracking-wider
            ">
            {getTranslationByKey('Select all that apply', translations, lang)}:
          </span>
          <button type="button" onClick={handleClose}>
            <Icons name="Close" />
          </button>
        </div>
        <div
          className="flex w-full flex-wrap gap-8 !overflow-y-auto px-10 py-12 md:gap-12 lg:gap-16
          xl:gap-x-20 2xl:gap-x-24 3xl:gap-x-28 4xl:gap-x-32">
          {_.map(items, (val) => (
            <div key={val.title} className="flex flex-col gap-y-6">
              <span className="font-noto text-clamp14to15 font-bold leading-1.5">
                {getTranslationByKey(val.title, translations, lang)}
              </span>
              <div className="flex flex-col gap-y-4">
                {_.map(val.options, (val2, ind) => {
                  const currFilterVal = _.get(selectedFilters, [val.title], []);
                  const isSelected = _.some(currFilterVal, (val3) => val3.value === val2.value);

                  return (
                    <button
                      key={ind}
                      type="button"
                      className="flex flex-nowrap gap-x-4 text-left"
                      onClick={() => handleFilterSelect(val.title, val2)}>
                      <div className="my-auto h-5 w-5">
                        <Icons
                          name="Unchecked"
                          className={`h-5 w-5 ${isSelected && 'bg-cherry'}`}
                        />
                      </div>
                      <span className="font-noto text-clamp14to15">
                        {getTranslationByKey(val2.value, translations, lang)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full gap-x-5 px-5 pb-6 pt-4 md:gap-x-12 md:px-10 md:pb-16">
          <Button
            variant="primaryCherry"
            label={getTranslationByKey('APPLY FILTERS', translations, lang)}
            clickHandler={handleClose}
          />
          <button
            type="button"
            className="px-4 font-noto text-clamp14to15 font-bold underline"
            onClick={handleClearFilters}>
            {getTranslationByKey('Clear all selection', translations, lang)}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default FilterModal;
