import React from 'react';
import _ from 'lodash';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AttachmentsFooterImage({ data }) {
  const image = _.get(data, 'properties.attachmentsSingleImage', null);
  if (_.isEmpty(image)) return null;
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      viewport={{ once: true }}
      className={`relative z-30 `}>
      <div className="w-full">
        {_.isEmpty(image) || (
          <Image
            src={image[0].url}
            alt="Attachements Details Image"
            fill
            className="!relative h-full w-full"
          />
        )}
      </div>
    </motion.section>
  );
}
