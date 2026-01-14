'use client';

import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import Image from 'next/image';
import _ from 'lodash';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';

export default function IntroTextWithBgImage({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const image = _.get(data, 'properties.image[0]', {});
  const cssClass = _.get(data, 'properties.cssClass', '');

  return (
    <section id={id} className="relative overflow-hidden pb-[50vw] pt-10 lg:pb-[42vw] lg:pt-[80px]">
      {_.isEmpty(image) || (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}>
          <Image
            src={image.url}
            alt="Intro Text With Bg Image"
            fill
            className={classNames(
              '!absolute !top-[auto] bottom-0 !h-auto !w-full object-contain',
              cssClass,
            )}
          />
        </motion.div>
      )}
      <BoxedContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col gap-y-4 pb-[60px] md:gap-y-5 md:pb-[110px] lg:gap-y-10">
          <TitleSection data={title} className="lg:max-w-[640px]" />
          {_.isEmpty(text) || (
            <div
              className="font-noto text-clamp14to18 font-normal leading-1.77 text-primary
              lg:max-w-[640px]"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </motion.div>
      </BoxedContainer>
    </section>
  );
}
