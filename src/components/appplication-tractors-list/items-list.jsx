/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import React from 'react';
import { motion } from 'framer-motion';
import useElementSize from '@/hooks/use-element-size';
import Item from './item';

export default function ItemsList({ items, handleClick, currProduct }) {
  const [elRef, width] = useElementSize();

  const seriesMap = items.reduce((result, item) => {
    const series = item.properties.series;
    if (!result[series]) {
      result[series] = [];
    }
    result[series].push(item);
    return result;
  }, {});

  const allSeriesItems = Object.values(seriesMap).flat();

  return (
    <div className="py-t flex flex-col lg:pt-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        viewport={{ once: true }}
        ref={elRef}
        className="flex w-full flex-col gap-y-8">
        <div className="grid grid-cols-2 flex-wrap gap-x-8 gap-y-10 xs:flex xs:flex-row">
          {allSeriesItems.map((val, index) => (
            <Item
              key={index}
              item={val}
              currProduct={currProduct}
              index={index}
              handleClick={handleClick}
              parentLabel={val.label}
              width={width}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
