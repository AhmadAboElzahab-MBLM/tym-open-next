/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import _ from 'lodash';
import useElementSize from '@/hooks/use-element-size';
import { getProductPower } from '@/helpers/product-handlers';
import Item from './item';

export default function ItemsList({ items, handleClick, currProduct, lang, orderHpPs }) {
  const [width] = useElementSize();
  const pathUrl = usePathname();
  const koPaths = ['/ko', '/en-ko'];
  const isKO = _.some(koPaths, (koPath) => _.includes(pathUrl, koPath));

  // Category priority map
  const categoryPriority = {
    'Tractors': 1,
    'Harvesters': 2,
    'Rice Transplanters': 3,
  };

  // Sorting logic: by category priority, then product power
  const sortedItems = [...items].sort((a, b) => {
    const categoryA = a.properties.category || '';
    const categoryB = b.properties.category || '';

    const priorityA = categoryPriority[categoryA] || 99; // Default low priority
    const priorityB = categoryPriority[categoryB] || 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB; // Sort by category priority
    }

    const powerA = getProductPower(a, isKO);
    const powerB = getProductPower(b, isKO);
    return powerA - powerB; // Sort by product power
  });

  return (
    <div className="flex flex-col py-4 lg:py-6">
      <motion.div className="grid grid-cols-2 flex-wrap gap-x-8 gap-y-10 xs:flex xs:flex-row">
        {orderHpPs
        ? sortedItems.map((val, ind) => (
          <Item
            key={ind}
            item={val}
            currProduct={currProduct}
            index={ind}
            handleClick={handleClick}
            parentLabel={val.label}
            width={width}
            lang={lang}
          />
        )) 
        : items.map((val, ind) => (
          <Item
            key={ind}
            item={val}
            currProduct={currProduct}
            index={ind}
            handleClick={handleClick}
            parentLabel={val.label}
            width={width}
            lang={lang}
          />
        ))}
      </motion.div>
    </div>
  );
}
