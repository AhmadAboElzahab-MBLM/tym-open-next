import React from 'react';
import { motion } from 'framer-motion';
import SelectDropdown from '@/components/layout/select-dropdown';
import _ from 'lodash';
import { getTranslationByKey } from '@/utils/translation-helper';

function SelectorOption({ item, maxWidth, selected, setRefs, onSelect, defaultValue }) {
  switch (item.view) {
    case 'select':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative flex w-full items-start gap-x-2 sm:w-[calc(50%-0.625rem)]
          md:w-80 md:gap-x-4">
          <span
            ref={setRefs}
            style={{ width: maxWidth ? `${maxWidth}px` : 'auto' }}
            className="flex-shrink-0 text-clamp14to15 font-bold uppercase">
            {getTranslationByKey('Select')} :
          </span>
          <div className="flex-grow">
            <SelectDropdown items={item} onSelect={onSelect} defaultValue={defaultValue} />
          </div>
        </motion.div>
      );
    case 'inline':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex w-full gap-x-2 overflow-x-auto md:gap-x-6 xl:w-auto">
          <span className="pt-1 text-clamp14to15 font-bold uppercase">{item.label}</span>
          <div className="flex gap-x-2 md:gap-x-6">
            {_.map(item.items, (val, index) => (
              <motion.button
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                viewport={{ once: true }}
                key={index}
                onClick={() => onSelect({ type: item.type, value: val.value })}
                type="button"
                className={`min-w-[1.25rem] whitespace-pre border-b-4 border-[transparent] p-1 pb-1
                 text-clamp14to15 font-bold uppercase transition-all hover:text-cherry lg:pb-4
                  ${null ? 'border-primary' : 'border-[transparent]'}`}>
                {val.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      );
    default:
      return null;
  }
}

export default SelectorOption;
