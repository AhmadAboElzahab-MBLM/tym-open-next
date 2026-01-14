import React from 'react';
import { get, isEmpty } from 'lodash';
import Image from 'next/image';
import { motion } from 'framer-motion';
import BoxedContainer from '../layout/boxed-container';

export default function TightImageBanner({ data, id }) {
  const title = get(data, 'properties.title.markup');
  const subtitle = get(data, 'properties.subtitle.markup');
  const image = get(data, 'properties.image[0].url');
  const caption = get(data, 'properties.caption.markup');
  return (
    <section
      id={id}
      className="bg-white py-15
               text-clamp12to15   
               leading-[24px] text-primary ">
      <BoxedContainer className="!max-w-[60rem]">
        <div className="flex flex-col">
          {!isEmpty(title) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-8 text-clamp20to28  uppercase  
                    leading-1.42 text-primary"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {!isEmpty(subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8 font-noto text-clamp16to18   leading-1.42
                    text-primary md:mb-15"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}

          {!isEmpty(image) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative mb-8 aspect-[129/67] font-noto text-clamp20to28  
                    leading-1.42 text-primary">
              <Image src={image} fill className="object-cover" alt={title || 'Image'} />
            </motion.div>
          )}
          {!isEmpty(caption) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className=" font-noto text-clamp16to18  
                    leading-1.42 text-primary"
              dangerouslySetInnerHTML={{ __html: caption }}
            />
          )}
        </div>
      </BoxedContainer>
    </section>
  );
}
