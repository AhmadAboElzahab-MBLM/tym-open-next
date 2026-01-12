'use client';

import React, { useContext } from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';
import SelectDropdown from '@/components/layout/select-dropdown';
import Icons from '@/components/layout/icons';
import useMaxWidthFromElements from '@/hooks/use-max-width-from-elements';

function Filter({ filterOptions, setSelectedFilter, selectedFilter, productTypes }) {
  const { translations, lang } = useContext(GlobalContext);
  const [maxWidth, setRefs] = useMaxWidthFromElements();
  const filterOrder = ['All', 'News', 'Story', 'Technology', 'Exhibition', 'Survey', 'Comparison'];
  const customOrder = [
    'All Products',
    'Tractors',
    'Harvesters',
    'Rice Transplanters',
    'Others',
    'Cultivators',
    'Diesel Engine',
  ];
  const sortedProductTypes = _.chain(productTypes)
    .compact()
    .sortBy((type) => {
      const index = customOrder?.findIndex((order) => order.toLowerCase() === type.toLowerCase());
      return index === -1 ? Infinity : index;
    })
    .value();

  return (
    <div className="flex flex-col gap-y-4 py-4 lg:gap-y-8 lg:py-6 lg:pt-4">
      <span
        className="font-noto text-clamp14to15 font-bold uppercase
      tracking-[1.5px] text-primary">
        {getTranslationByKey('Filters', translations, lang)}:
      </span>
      <div className="flex flex-wrap justify-between gap-3 pb-6 md:gap-6 lg:justify-start">
        {_.chain(filterOptions)
          .sortBy((val) => {
            const index = filterOrder?.findIndex(
              (order) => order.toLowerCase() === val.label.toLowerCase(),
            );
            return index === -1 ? Infinity : index;
          })
          .map((val, ind) => (
            <motion.button
              key={ind}
              onClick={() => setSelectedFilter({ type: val.value })}
              type="button"
              className={`latest-news-filter-button w-full whitespace-pre px-4 py-5
              text-center text-clamp14to15 font-bold uppercase text-primary
              transition-all before:mr-2 before:inline before:content-['+']
              sm:w-[calc(50%-0.75rem)] md:w-[calc(25%-1.25rem)] lg:basis-[11.25rem]
              ${
                _.isEqual(val.value, selectedFilter.type)
                  ? 'bg-cherry text-white'
                  : 'bg-platinum hover:bg-pastelGrey'
              }`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: ind * 0.1 }}
              viewport={{ once: true }}>
              {getTranslationByKey(val.label, translations, lang)}
            </motion.button>
          ))
          .value()}
      </div>

      <div
        className="flex flex-wrap items-end gap-5 border-cherry sm:border-b md:gap-x-8
            lg:gap-x-12 xl:gap-x-16 2xl:gap-x-[127px]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative flex w-full items-start gap-x-2 border-b border-cherry
                sm:w-[calc(50%-0.625rem)] sm:border-none md:w-80 md:gap-x-4">
          <span
            ref={setRefs}
            style={{ width: maxWidth ? `${maxWidth}px` : 'auto' }}
            className="flex-shrink-0 font-noto text-clamp14to15 font-bold uppercase
            tracking-[1.5px] text-primary">
            {getTranslationByKey('Select', translations, lang)}:
          </span>
          <div className="flex-grow">
            <SelectDropdown
              defaultValue="PRODUCT TYPE"
              items={sortedProductTypes}
              view="select"
              onSelect={(selectedValue) => {
                setSelectedFilter(() => {
                  if (selectedValue === 'PRODUCT TYPE') {
                    return { productType: '' };
                  }
                  return { productType: selectedValue };
                });
              }}
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative flex w-full items-start gap-x-2 border-b border-cherry
              sm:w-[calc(50%-0.625rem)] sm:border-none md:gap-x-4">
          <span
            ref={setRefs}
            style={{ width: maxWidth ? `${maxWidth}px` : 'auto' }}
            className="flex-shrink-0 font-noto text-clamp14to15 font-bold uppercase
            tracking-[1.5px] text-primary">
            {getTranslationByKey('Search', translations, lang)}:
          </span>
          <div className="relative flex-grow md:max-w-[22rem]">
            <input
              type="text"
              className="w-full border-b-4 border-primary pb-3 font-noto text-clamp14to15
              text-primary placeholder-primary"
              placeholder={getTranslationByKey('Keyword or phrase', translations, lang)}
              onChange={(e) => setSelectedFilter({ searchTerm: e.target.value })}
            />
            <Icons
              name="Search"
              className="absolute right-0 top-1/2 -translate-y-1/2 !stroke-primary"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Filter;
