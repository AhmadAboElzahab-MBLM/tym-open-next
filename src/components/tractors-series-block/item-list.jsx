import React from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import useElementSize from '@/hooks/use-element-size';
import Item from '@/components/products-paginated/item';

function ItemsList({ items, handleClick, currProduct }) {
  const [elRef, width] = useElementSize();

  return (
    <div className="flex flex-col py-4 lg:py-6">
      {_.map(items, (val, ind) => (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: ind * 0.1 }}
          viewport={{ once: true }}
          ref={elRef}
          key={ind}
          className="flex w-full flex-col gap-y-8 border-b border-cherry py-10 first:pt-1 lg:py-14">
          <h3 className="text-clamp20to28 font-bold uppercase leading-1.42">{val.label}</h3>
          <div className="grid grid-cols-2 flex-wrap gap-x-8 gap-y-10 xs:flex xs:flex-row">
            {_.map(val.items, (item, index) => (
              <Item
                key={index}
                item={item}
                currProduct={currProduct}
                index={index}
                handleClick={handleClick}
                parentLabel={val.label}
                width={width}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default ItemsList;
