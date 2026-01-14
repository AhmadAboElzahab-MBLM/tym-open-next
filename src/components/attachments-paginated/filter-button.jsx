import React, { useContext } from 'react';
import GlobalContext from '@/context/global-context';
import { motion } from 'framer-motion';
import { getTranslationByKey } from '@/utils/translation-helper';

function FilterButton({ item, handleFilter, selected }) {
  const { translations, lang } = useContext(GlobalContext);
  return (
    <motion.button
      onClick={() => handleFilter(item)}
      type="button"
      data-selected={selected}
      className="w-full whitespace-pre px-4 py-4 text-center text-clamp14to15
      font-bold uppercase transition-all before:mr-2 before:inline before:content-['+']
      hover:bg-pastelGrey data-[selected=false]:bg-platinum data-[selected=true]:bg-cherry data-[selected=true]:text-white
      sm:w-[calc(50%-0.75rem)] md:w-[calc(25%-1.25rem)] lg:basis-56 text-primary
      attachment-filter-button"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      viewport={{ once: true }}>
      {getTranslationByKey(item, translations, lang)}
    </motion.button>
  );
}

export default FilterButton;
