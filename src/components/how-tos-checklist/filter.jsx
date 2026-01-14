import React, { useContext } from 'react';
import _ from 'lodash';
import useMaxWidthFromElements from '@/hooks/use-max-width-from-elements';
import SelectDropdown from '@/components/layout/select-dropdown';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

function Filter({
  filterOptions,
  tractorModel,
  setSelectedFilter,
  selectedFilter,
  filterSeriesOptions,
}) {
  const { translations, lang } = useContext(GlobalContext);

  const [maxWidth, setRefs] = useMaxWidthFromElements();
  const seriesName = {
    All: 'All',
    'Series 1': '1',
    'Series 2': '2',
    'Series 3': '3',
    'Series 4': '4',
    'Series 5': '5',
    'Series 6': '6',
    ISEKI: 'ISEKI',
    'John Deere': 'John Deere',
    'Front-End Loader': 'Front-End Loader',
  };
  const filteredOptions = filterSeriesOptions.filter(
    (option) => option.label !== null && option.value !== null,
  );

  const sortedFilterSeriesOptions = _.sortBy(filteredOptions, (val) =>
    Object.keys(seriesName).indexOf(val.label),
  );

  return (
    <div className="flex flex-col gap-y-4 py-4 lg:gap-y-7 lg:py-6 lg:pb-[48px]">
      <span
        className="font-noto text-clamp14to15 font-bold uppercase
      tracking-[1.5px] text-primary">
        {getTranslationByKey('Filters', translations, lang)}:
      </span>
      <div
        className="flex flex-wrap gap-3 pb-6 sm:justify-between sm:gap-6 lg:justify-start
      lg:pb-[32px]">
        {_.isEmpty(filterOptions) ||
          _.map(filterOptions, (val, ind) => (
            <button
              key={ind}
              onClick={() => setSelectedFilter({ type: val.value })}
              type="button"
              className={`w-fit whitespace-pre px-8 py-3 text-center
              text-clamp12to15 font-bold uppercase text-primary transition-all
              before:mr-2 before:inline before:content-['+'] sm:w-[calc(50%-0.75rem)] sm:px-4 sm:py-5
              md:w-[calc(25%-1.25rem)] lg:basis-[11.25rem] how-to-checklist-filter-button
            ${
              _.isEqual(val.value, selectedFilter.type)
                ? 'bg-cherry text-white'
                : 'bg-platinum hover:bg-pastelGrey'
            }`}>
              {getTranslationByKey(val.label, translations, lang)}
            </button>
          ))}
      </div>
      <div
        className="flex flex-wrap items-end gap-8 border-b border-cherry md:gap-5
        md:gap-x-8 lg:gap-x-12 xl:gap-x-16 2xl:gap-x-[127px]">
        <div
          className="relative flex w-full items-start gap-x-4 border-b
                border-cherry sm:w-[calc(50%-0.625rem)] sm:border-none md:w-80">
          <span
            ref={setRefs}
            style={{ width: maxWidth ? `${maxWidth}px` : 'auto' }}
            className="flex-shrink-0 font-noto text-clamp14to15 font-bold uppercase
            tracking-[1.5px] text-primary">
            {getTranslationByKey('Select', translations, lang)}:
          </span>
          <div className="z-20 flex-grow">
            <SelectDropdown
              defaultValue="Tractor Model"
              items={tractorModel}
              view="select"
              onSelect={(selectedValue) => {
                setSelectedFilter(() => {
                  if (selectedValue === 'Tractor Model') {
                    return { tractorModel: '' };
                  }
                  return { tractorModel: selectedValue };
                });
              }}
            />
          </div>
        </div>
        <div
          className="relative flex w-full items-start gap-x-4 border-b border-cherry
          sm:border-none lg:w-[60%]">
          <span
            ref={setRefs}
            style={{ width: maxWidth ? `${maxWidth}px` : 'auto' }}
            className="flex-shrink-0 font-noto text-clamp14to15 font-bold uppercase
            tracking-[1.5px] text-primary">
            {getTranslationByKey('Series', translations, lang)}:
          </span>
          <div className="flex flex-row flex-wrap justify-between gap-[28px] lg:justify-start">
            {_.map(
              sortedFilterSeriesOptions,
              (val, ind) =>
                _.isEmpty(seriesName[val.label]) || (
                  <button
                    key={ind}
                    onClick={() => setSelectedFilter({ series: val.value })}
                    type="button"
                    className={`pb-[12px] font-noto text-[15px] font-bold uppercase tracking-[1.5px]
                text-primary how-to-checklist-series-button
            ${
              _.isEqual(val.value, selectedFilter.series)
                ? 'border-b-4 border-primary'
                : 'border-b-4 border-b-white'
            }`}>
                    {getTranslationByKey(seriesName[val.label], translations, lang)}
                  </button>
                ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;
