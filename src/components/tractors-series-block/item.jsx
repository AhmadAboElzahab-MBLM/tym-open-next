import React from 'react';
import _ from 'lodash';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ItemModal from './item-modal';

function Item({ item, currProduct, index, handleClick, parentLabel, width }) {
  const isOpen = _.isEqual(item, currProduct);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="w-full xs:w-[calc(50%-1rem)] sm:w-[calc(33%-1.25rem)] lg:w-[calc(25%-1.5rem)]">
      <button
        type="button"
        key={index}
        disabled={_.isEqual(item, currProduct)}
        className="flex w-full flex-col gap-y-5 disabled:opacity-50"
        onClick={() => handleClick(item, 'add')}>
        {_.isEmpty(item.image) || (
          <Image
            src={item.image}
            alt={`${item.model} (${item.ps} ${item.unit})`}
            fill
            className="!relative !object-contain"
          />
        )}

        <div className="flex flex-col items-start gap-y-2.5">
          <h4 className="text-clamp18to21 font-bold uppercase leading-1.125">
            {`${item.model} (${item.ps} ${item.unit})`}
          </h4>
          <p className="font-noto text-clamp14to15">
            {`${parentLabel}, ${item.group} ${item.vehicle}`}
          </p>
        </div>
      </button>
      <ItemModal isOpen={isOpen} width={width} selected={currProduct} handleClick={handleClick} />
    </motion.div>
  );
}

export default Item;
