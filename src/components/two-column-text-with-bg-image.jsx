/* eslint-disable react/no-danger */
import React from 'react';
import Image from 'next/image';
import _ from 'lodash';
import { motion } from 'framer-motion';
import BoxedContainer from './layout/boxed-container';

export default function TwoColumnTextWithBgImage({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const image = _.get(data, 'properties.image[0]', {});
  const pushImageDown = _.get(data, 'properties.pushImageDown');

  return (
    <section
      id={id}
      className={`relative overflow-hidden bg-white pt-[100px] md:pt-[120px]
      lg:pt-[200px] xl:pt-[284px] ${pushImageDown !== null ? '' : 'pb-[50vw] lg:pb-[42vw]'} `}>
      <BoxedContainer className="relative z-20">
        <div
          className="flex flex-col gap-y-[10px] md:flex-row md:gap-x-[40px] md:gap-y-0
        lg:gap-x-[84px]">
          <div
            className="promo-font h2-child:!font-sans max-w-[492px] font-sans text-[40px]
            font-bold uppercase leading-[46px] text-primary md:text-[50px] md:leading-1
            lg:text-[71px] xl:text-[97px]
          "
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <div
            className="max-w-[556px] pt-[5px] font-noto text-[12px] font-normal
            leading-1.625 text-primary md:text-[16px] lg:text-[18px] lg:leading-[32px] xl:pt-[10px]"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </BoxedContainer>

      {_.isEmpty(image) || (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}>
          <Image
            src={image.url}
            alt={image.name}
            fill
            className={`${pushImageDown !== null ? '!relative xl:!mt-[-30px]' : '!mt-[auto]'} 
            bottom-0 !h-auto !w-full object-contain`}
          />
        </motion.div>
      )}
    </section>
  );
}

