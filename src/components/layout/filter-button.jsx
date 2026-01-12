import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

function FilterButton({ item, handleFilter, isSelected }) {
  const { translations, lang } = useContext(GlobalContext);

  return (
    <motion.button
      onClick={() => handleFilter(item)}
      type="button"
      className={`w-full whitespace-pre px-4 py-4 text-center text-clamp14to15
      font-bold uppercase transition-all before:mr-2 before:inline before:content-['+']
      sm:w-[calc(50%-0.75rem)] md:w-[calc(25%-1.25rem)] lg:basis-56 text-primary
      ${isSelected ? 'bg-cherry text-white' : 'bg-platinum hover:bg-pastelGrey'}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      viewport={{ once: true }}>
      {getTranslationByKey(item, translations, lang)}
    </motion.button>
  );
}

export default FilterButton;
