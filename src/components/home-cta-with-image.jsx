'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import _ from 'lodash';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import BoxedContainer from './layout/boxed-container';
import Button from './layout/button';

export default function HomeCtaWithImage({ data, id, lang }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const image = _.get(data, 'properties.image[0]', {});
  const link = _.get(data, 'properties.link[0]', {});
  if (link) {
    resolveInternalLinks(link, lang);
  }

  return (
    <section id={id} className="flex flex-col-reverse pt-10 md:flex-col md:pt-[90px]">
      <BoxedContainer>
        <div
          className="flex flex-col justify-between gap-y-6 md:flex-row md:gap-x-[33px]
        md:gap-y-[0px]">
          {_.isEmpty(title) || (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className="max-w-[544px] text-clamp52to100 font-bold uppercase leading-1 text-primary
              md:w-[40%] lg:w-auto"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex max-w-[526px] flex-col gap-y-6 md:w-[60%] lg:w-[auto]
          lg:gap-y-[30px] lg:pt-[10px] xl:gap-y-[51px]">
            {_.isEmpty(text) || (
              <div
                className="font-noto text-clamp14to18 font-normal leading-1.77 text-primary"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}

            {_.isEmpty(link) || (
              <Button
                url={link.url}
                label={link.title}
                target={link.target}
                variant="primaryMercury"
                text="lg:w-[353px] w-[250px] home-cta-link"
              />
            )}
          </motion.div>
        </div>
      </BoxedContainer>
      {_.isEmpty(image) || (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto w-full max-w-[1920px] pb-[25px] md:pb-0 lg:pt-[72px]">
          <Image src={image.url} alt={image.name} fill className="!relative h-full w-full" />
        </motion.div>
      )}
    </section>
  );
}
