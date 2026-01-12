import React, { useContext } from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import useMaxWidthFromElements from '@/hooks/use-max-width-from-elements';
import SelectDropdown from '@/components/layout/select-dropdown';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

function Filter({ productTypes, tractorModel, handleFilter, selectedFilter, series }) {
  const [maxWidth, setRefs] = useMaxWidthFromElements();
  const { translations, lang } = useContext(GlobalContext);
  const seriesOrder = [
    'All',
    'Series 1',
    'Series 2',
    'Series 3',
    'Series 4',
    'Series 5',
    'Series 6',
    'Imported',
    'ISEKI',
    'John Deere',
    'Front-End Loader',
    'Mid-Mount Mower',
    'Backhoe',
  ];
  const seriesOrderMap = _.zipObject(seriesOrder, _.range(seriesOrder.length));
  const sortedSeries = _.sortBy(series, (s) =>
    seriesOrderMap[s.label] !== undefined ? seriesOrderMap[s.label] : seriesOrder.length,
  );

  return (
    <div className="flex flex-col gap-y-4 py-4 lg:gap-y-7 lg:py-6 lg:pb-3">
      <span
        className="font-noto text-clamp14to15 font-bold uppercase
      tracking-[1.5px] text-primary">
        {getTranslationByKey('Filters', translations, lang)}:
      </span>
      <div className="flex flex-wrap justify-between gap-4 pb-8 md:gap-6 lg:justify-start">
        {_.map(productTypes, (val, ind) => (
          <motion.button
            key={ind}
            onClick={() => handleFilter({ productType: val.value === '' ? '' : val.value })}
            type="button"
            className={`success-stories-filter-button w-full whitespace-pre px-4 py-5
            text-center text-clamp14to15 font-bold uppercase text-primary transition-all
            before:mr-2 before:inline before:content-['+'] sm:w-[calc(50%-0.75rem)]
            md:w-[calc(25%-1.25rem)] lg:basis-[11.25rem]
            ${
              _.isEqual(val.value, selectedFilter.productType)
                ? 'bg-cherry text-white'
                : 'bg-platinum hover:bg-pastelGrey'
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: ind * 0.1 }}
            viewport={{ once: true }}>
            {getTranslationByKey(val.label, translations, lang)}
          </motion.button>
        ))}
      </div>
      <div
        className="flex flex-wrap items-end gap-5 border-b border-cherry md:gap-x-8 lg:gap-x-12
        xl:gap-x-16 2xl:gap-x-[127px]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative flex w-full items-start gap-x-4 border-b border-cherry
          sm:w-[calc(50%-0.625rem)] sm:border-none md:w-80">
          <span
            ref={setRefs}
            style={{ width: maxWidth ? `${maxWidth}px` : 'auto' }}
            className="flex-shrink-0 font-noto text-clamp14to15 font-bold uppercase
            tracking-[1.5px] text-primary">
            {getTranslationByKey('Select', translations, lang)}:
          </span>
          <div className="z-20 flex-grow">
            <SelectDropdown
              defaultValue="TRACTOR MODEL"
              items={tractorModel}
              view="select"
              onSelect={(val) => handleFilter({ tractorModel: val })}
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative flex w-full items-start gap-x-4 border-b border-cherry
          sm:border-none lg:w-[60%]">
          <span
            ref={setRefs}
            style={{ width: maxWidth ? `${maxWidth}px` : 'auto' }}
            className="flex-shrink-0 font-noto text-clamp14to15 font-bold uppercase
            tracking-[1.5px] text-primary">
            {lang === 'ko' ? '시리즈' : 'SERIES'}:
          </span>
          <div className="flex flex-row flex-wrap justify-between gap-4 md:gap-[28px] lg:justify-start">
            {_.map(sortedSeries, (val, ind) => (
              <motion.button
                key={ind}
                onClick={() => handleFilter({ series: val.value })}
                type="button"
                className={`success-stories-series-button pb-[12px] font-noto text-clamp14to15
                font-bold uppercase tracking-[1.5px] text-primary ${
                  _.isEqual(val.value, selectedFilter.series)
                    ? 'border-b-4 border-primary'
                    : 'border-b-4 border-b-white'
                }`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: ind * 0.1 }}
                viewport={{ once: true }}>
                {_.includes(val.label, 'Series ')
                  ? _.replace(val.label, 'Series ', '')
                  : getTranslationByKey(val.label, translations, lang)}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Filter;
