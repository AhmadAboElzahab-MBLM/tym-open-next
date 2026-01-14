'use client';

import React from 'react';
import { motion } from 'framer-motion';
import _ from 'lodash';
import Image from 'next/image';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import BoxedContainer from './layout/boxed-container';
import SubtitleSection from './layout/subtitle-section';
import TitleSection from './layout/title-section';
import Button from './layout/button';

export default function TractorsCard({ id, data, lang }) {
  const items = _.get(data, 'properties.items.items', []);

  _.forEach(items, (item) => {
    const link = _.get(item, 'content.properties.link[0]', {});
    resolveInternalLinks(link, lang);
  });

  return (
    <section id={id} className="pt-10 md:pt-[80px] lg:pt-[120px]">
      <BoxedContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col gap-y-[35px] pb-[60px] md:gap-y-[50px] md:pb-[80px]
          lg:gap-y-[100px] lg:pb-[120px]">
          {_.map(items, (item, index) => {
            const image = _.get(item, 'content.properties.image[0]', null);
            const link = _.get(item, 'content.properties.link[0]', null);
            const subtitle = _.get(item, 'content.properties.subtitle', null);
            const title = _.get(item, 'content.properties.title.markup', null);
            const text = _.get(item, 'content.properties.text.markup', null);
            return (
              <div
                key={index}
                className="flex flex-col gap-x-[20px] gap-y-6 md:flex-row md:gap-y-[0px]
                lg:gap-x-[50px] xl:gap-x-[117px]">
                <div className="flex flex-col gap-y-[20px] md:max-w-[366px] lg:gap-y-[40px]">
                  <div className="flex flex-col gap-y-4 md:gap-y-[15px] lg:gap-y-[32px]">
                    <SubtitleSection
                      data={subtitle}
                      className="!mb-0 tracking-[1px] md:tracking-[1.50px]"
                    />
                    <TitleSection data={title} />
                    {_.isEmpty(text) || (
                      <div
                        className="font-noto text-[12px] font-normal leading-1.625 text-primary
                        md:text-[15px] md:leading-[24px]"
                        dangerouslySetInnerHTML={{ __html: text }}
                      />
                    )}
                  </div>
                  {_.isEmpty(link) || (
                    <Button
                      label={link.title}
                      url={link.url}
                      variant="primaryMercury"
                      text="lg:w-[353px] w-[250px] tractors-card-link"
                    />
                  )}
                </div>
                <div className="relative flex w-full items-end 2xl:mr-[-30px] 3xl:mr-[-100px]">
                  {_.isEmpty(image) || (
                    <Image
                      src={image.url}
                      alt={subtitle || image.name}
                      fill
                      className="!relative !h-auto w-full"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
        <div className="h-[1px] w-full bg-cherry" />
      </BoxedContainer>
    </section>
  );
}
