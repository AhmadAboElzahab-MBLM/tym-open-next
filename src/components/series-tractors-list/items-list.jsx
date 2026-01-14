/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import React from 'react';
import { motion } from 'framer-motion';
import _ from 'lodash';
import useElementSize from '@/hooks/use-element-size';
import Item from './item';

// Helper function to extract power value from item
const getPowerValue = (item) => {
  const specs = _.get(item, 'properties.specifications.items', []);
  const product = _.find(specs, (val) => _.isEqual(val.content.properties.title, 'Engine power'));
  const powerText = product?.content?.properties?.valueText || '';
  // Extract decimal or integer value from power text (e.g., "34.7 hp", "48 HP", "24.5")
  const match = powerText.match(/\d+(\.\d+)?/);
  const numericValue = match ? parseFloat(match[0]) : 0;
  return numericValue;
};

export default function ItemsList({ title, items, handleClick, currProduct }) {
  const [elRef, width] = useElementSize();

  const seriesMap = items.reduce((result, item) => {
    const series = item.properties.series;
    if (!result[series]) {
      result[series] = [];
    }
    result[series].push(item);
    return result;
  }, {});

  // Sort items within each series by power (HP)
  Object.keys(seriesMap).forEach((series) => {
    seriesMap[series].sort((a, b) => {
      const powerA = getPowerValue(a);
      const powerB = getPowerValue(b);
      return powerA - powerB; // Sort in ascending order (lowest to highest HP)
    });
  });

  return (
    <div className="py-t flex flex-col">
      {Object.entries(seriesMap).map(
        ([seriesName, seriesItems], seriesIndex) => ( // eslint-disable-line no-unused-vars
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: seriesIndex * 0.1 }}
            viewport={{ once: true }}
            ref={elRef}
            key={seriesIndex}
            className="flex w-full flex-col gap-y-8 pt-10 first:pt-1 lg:pt-14">
            <h3 className="text-clamp20to28 font-bold uppercase leading-1.42">{title}</h3>
            <div className="grid grid-cols-2 flex-wrap gap-x-8 gap-y-10 xs:flex xs:flex-row">
              {seriesItems.map((val, ind) => (
                <Item
                  key={ind}
                  item={val}
                  currProduct={currProduct}
                  index={ind}
                  handleClick={handleClick}
                  parentLabel={val.label}
                  width={width}
                />
              ))}
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}
