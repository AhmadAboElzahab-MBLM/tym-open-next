import _ from 'lodash';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export default function SingleImage({ data, id }) {
  const { classname, image, insideContainer } = data.properties;
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      viewport={{ once: true }}
      className={`${classname} relative z-30 pt-4 md:pt-10`}>
      <div
        className={`${
          insideContainer ? 'container relative mx-auto max-w-[70rem] px-4 xl:px-0' : ''
        } single-image mx-auto`}>
        {_.isEmpty(image) || (
          <Image src={image[0].url} 
          alt={id || image[0].name} 
          fill className="!relative h-full w-full" />
        )}
      </div>
    </motion.section>
  );
}
