/* eslint-disable max-len */
import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { getTranslationByKey } from '@/utils/translation-helper';
import { orderBy, map, get, max, snakeCase, filter, startCase, toLower } from 'lodash';
import GlobalContext from '@/context/global-context';
import useElementSize from '@/hooks/use-element-size';
import Item from './item';

export default function ItemsList({ data, handleClick, currProduct }) {
  const { translations, lang } = useContext(GlobalContext);
  const [elRef, width] = useElementSize();
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    // Custom sorting function
    const customSort = (itemA, itemB) => {
      const valueTextA = get(itemA, 'properties.specifications.items.content.properties.valueText');
      const valueTextB = get(itemB, 'properties.specifications.items.content.properties.valueText');

      // If valueText is null, put the item first
      if (valueTextA === null && valueTextB === null) return 0;
      if (valueTextA === null) return -1;
      if (valueTextB === null) return 1;

      const valueUSA = get(
        itemA,
        'properties.specifications.items.content.properties.valueUS',
        -Infinity,
      );
      const valueMetricA = get(
        itemA,
        'properties.specifications.items.content.properties.valueMetric',
        -Infinity,
      );
      const valueMetricB = get(
        itemB,
        'properties.specifications.items.content.properties.valueMetric',
        -Infinity,
      );

      return valueUSA !== -Infinity
        ? valueUSA - max([valueMetricA, valueMetricB])
        : valueMetricB - valueMetricA;
    };

    const sortedDataList = map(data, (val) => ({
      ...val,
      values: orderBy(val?.values, customSort, 'asc'),
    }));

    setSortedData(sortedDataList);
  }, [data]);

  function extractAndFormatKey(key) {
    if (!key || typeof key !== 'string') return '';
    const parts = key.split('/');
    const [category, subCategory, series] = parts.map((part) => snakeCase(part));
    let chosenPart = category;

    if (subCategory !== 'no_subcategory') chosenPart = subCategory;
    if (series !== 'no_series') chosenPart = series;

    return startCase(toLower(chosenPart));
  }

  return (
    <div className="flex flex-col py-2 lg:py-6" ref={elRef}>
      {map(sortedData, (item, index) => {
        const itemValues = get(item, 'values', []);
        const filtered = filter(
          itemValues,
          (val) => !get(val, 'properties.hideFromListing', false),
        );
        // console.log(filtered);
        return filtered.length ? (
          <motion.div
            key={`list-${index}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: index * 0.01 }}
            viewport={{ once: true }}
            className="flex w-full flex-col gap-y-9 border-b border-cherry py-10 first:pt-1 lg:py-[60px]">
            <h3 className="text-clamp20to28 font-bold uppercase leading-1.42">
              {getTranslationByKey(extractAndFormatKey(item.key), translations, lang)}
            </h3>
            <div className="flex flex-wrap gap-x-8 gap-y-10 xs:flex-row">
              {map(filtered, (val, ind) => (
                <Item
                  key={`item-${ind}`}
                  index={ind}
                  item={val}
                  currProduct={currProduct}
                  handleClick={handleClick}
                  width={width}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <></>
        );
      })}
    </div>
  );
}
