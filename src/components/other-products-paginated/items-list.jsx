/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useElementSize from '@/hooks/use-element-size';
import Item from '@/components/products-paginated/item';
import { getTranslationByKey } from '@/utils/translation-helper';
import _ from 'lodash';

export default function ItemsList({ data, handleClick, currProduct }) {
  const [elRef, width] = useElementSize();
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    // Custom sorting function
    const customSort = (itemA, itemB) => {
      const valueTextA = _.get(
        itemA,
        'properties.specifications.items.content.properties.valueText',
      );
      const valueTextB = _.get(
        itemB,
        'properties.specifications.items.content.properties.valueText',
      );

      // If valueText is null, put the item first
      if (valueTextA === null && valueTextB === null) return 0;
      if (valueTextA === null) return -1;
      if (valueTextB === null) return 1;

      const valueUSA = _.get(
        itemA,
        'properties.specifications.items.content.properties.valueUS',
        -Infinity,
      );
      const valueMetricA = _.get(
        itemA,
        'properties.specifications.items.content.properties.valueMetric',
        -Infinity,
      );
      const valueMetricB = _.get(
        itemB,
        'properties.specifications.items.content.properties.valueMetric',
        -Infinity,
      );

      return valueUSA !== -Infinity
        ? valueUSA - _.max([valueMetricA, valueMetricB])
        : valueMetricB - valueMetricA;
    };

    // Sort items within each category based on custom sorting function
    const sortedDataList = _.map(data, (val) => ({
      ...val,
      values: _.orderBy(val?.values, customSort, 'asc'),
    }));

    setSortedData(sortedDataList);
  }, [data]);

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
      {_.map(sortedData, (val, index) => {
        const valValues = _.get(val, 'values', []);
        const filtered = _.filter(valValues, (item) => !item.properties.hideFromListing);
        return (
          <motion.div
            key={index}
            ref={elRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="flex w-full flex-col gap-y-8 border-b border-cherry py-10 first:pt-1 lg:py-14">
            <h3 className="text-clamp20to28 font-bold uppercase leading-1.42">
              {getTranslationByKey(extractAndFormatKey(val.key))}
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
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
