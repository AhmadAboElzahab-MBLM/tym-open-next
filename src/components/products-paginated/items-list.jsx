/* eslint-disable max-len */
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import GlobalContext from '@/context/global-context';
import useElementSize from '@/hooks/use-element-size';
import Item from '@/components/products-paginated/item';
import { getTranslationByKey } from '@/utils/translation-helper';
import { sortByEnginePowerByLang } from '@/helpers/product-handlers';
import _ from 'lodash';

export default function ItemsList({ data, handleClick, currProduct }) {
  const { translations, lang } = useContext(GlobalContext);
  const [elRef, width] = useElementSize();
  const productCategory = _.get(data[0], 'category', '');

  function extractAndFormatKey(key) {
    if (!key || typeof key !== 'string') return '';
    const parts = key.split('/');
    const [category, subCategory, series] = parts.map((part) => _.snakeCase(part));
    let chosenPart = category;

    if (subCategory !== 'no_subcategory') chosenPart = subCategory;
    if (series !== 'no_series') chosenPart = series;

    return _.startCase(_.toLower(chosenPart));
  }

  return (
    <div className="flex flex-col py-2 lg:py-6">
      {_.map(data, (val, index) => {
        const values = _.get(val, 'values', []);
        const filtered = _.filter(values, (item) => !item.properties.hideFromListing);

        // Sort the filtered items by engine power valueMetric in ascending order
        sortByEnginePowerByLang(filtered, lang);

        return (
          _.isEmpty(values) ||
          _.isEmpty(filtered) || (
            <motion.div
              key={index}
              ref={elRef}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex w-full flex-col gap-y-8 border-b border-cherry py-10 first:pt-1 lg:py-14">
              <h3 className="text-clamp20to28 font-bold uppercase leading-1.42">
                {getTranslationByKey(extractAndFormatKey(val.key), translations, lang)}
              </h3>
              <div className="flex flex-wrap gap-x-8 gap-y-10 xs:flex-row">
                {_.map(filtered, (item, ind) => (
                  <Item
                    key={ind}
                    item={item}
                    currProduct={currProduct}
                    index={ind}
                    handleClick={handleClick}
                    width={width}
                    category={productCategory}
                  />
                ))}
              </div>
            </motion.div>
          )
        );
      })}
    </div>
  );
}
