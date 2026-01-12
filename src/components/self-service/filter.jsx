'use client';

import React, { useContext } from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import SelectDropdown from '@/components/layout/select-dropdown';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

function Filter({
  filterOptions,
  setSelectedFilter,
  selfServiceCategory,
  selectedFilter,
  selectedCategory,
  setSelectedCategory,
}) {
  const { translations, lang } = useContext(GlobalContext);
  return (
    <div className="flex flex-col gap-y-4 pb-6 lg:gap-y-[28px] lg:pb-12">
      <span
        className="font-noto text-clamp12to15 font-bold uppercase tracking-[1.5px] text-primary
        ">
        {getTranslationByKey('Filters', translations, lang)}:
      </span>
      <div className="flex flex-wrap gap-3 pb-5 md:gap-6 md:pb-8 lg:justify-start">
        {_.map(filterOptions, (val, ind) => (
            <motion.button
              key={ind}
              onClick={() => {
                setSelectedFilter(val);
              }}
              type="button"
              className={`self-service-filter-button w-full min-w-[220px] whitespace-pre px-4 py-5 text-center
              text-clamp14to15 font-bold uppercase text-primary transition-all before:mr-2
              before:inline before:content-['+'] sm:w-fit md:w-[calc(25%-1.25rem)]
              lg:basis-[11.25rem]
            ${
              _.isEqual(val, selectedFilter)
                ? 'bg-cherry text-white'
                : 'bg-platinum hover:bg-pastelGrey'
            }`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: ind * 0.1 }}
              viewport={{ once: true }}>
              {getTranslationByKey(val, translations, lang)}
            </motion.button>
          ))}
      </div>
      <div
        className="flex flex-wrap items-end gap-5 border-cherry sm:border-b md:gap-x-8 lg:gap-x-12
        xl:gap-x-16 2xl:gap-x-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative flex w-full flex-col items-start gap-4 border-b border-cherry
          sm:w-[calc(50%-0.625rem)] sm:border-none md:w-[450px] md:flex-row">
          <span
            className="flex-shrink-0 font-noto text-clamp12to15 font-bold uppercase tracking-[1.5px]
            text-primary">
            {getTranslationByKey('SELECT ISSUE CATEGORY', translations, lang)}:
          </span>
          <div className="w-full flex-grow">
            <SelectDropdown
              defaultValue="All"
              selectedValue={{
                value: selectedCategory,
                label: getTranslationByKey(selectedCategory, translations, lang),
              }}
              items={selfServiceCategory}
              onSelect={(val) => setSelectedCategory(val)}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Filter;
