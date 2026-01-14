import React from 'react';
import _ from 'lodash';
import Image from 'next/image';
import { motion } from 'framer-motion';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import SubtitleSection from './layout/subtitle-section';
import BoxedContainer from './layout/boxed-container';
import Button from './layout/button';

export default function TymTractorsCtaCard({ data, id, lang }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const subtitle = _.get(data, 'properties.subtitle', '');
  const image = _.get(data, 'properties.image[0]', {});
  const link = _.get(data, 'properties.link[0]', {});
  resolveInternalLinks(link, lang);
  return (
    <section id={id} className="bg-white pb-10 pt-10 lg:pb-[140px] lg:pt-[80px]">
      <BoxedContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col gap-y-[20px] md:flex-row md:gap-y-0">
          <div className="md:w-[50%]">
            {_.isEmpty(image) || (
              <Image src={image.url} alt={title || image.name} 
              fill className="!relative h-full w-full" />
            )}
          </div>
          <div
            className="flex flex-col justify-center gap-y-[25px] md:w-[50%] md:pl-[20px]
            lg:gap-y-[32px] lg:pl-[84px]">
            <div className="flex flex-col gap-y-3 lg:gap-y-[28px]">
              <div className="flex flex-col gap-y-[10px] md:gap-y-[20px] lg:gap-y-[32px]">
                <SubtitleSection data={subtitle} className='tracking-[1.5px]'/>
                {_.isEmpty(title) || (
                  <div
                    className="text-clamp20to28 font-bold uppercase leading-1.42 md:max-w-[312px]"
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                )}
              </div>
              {_.isEmpty(text) || (
                <div
                  className="font-noto text-clamp12to15 font-normal leading-1.625 text-black
              md:max-w-[440px] lg:leading-[160%]"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              )}
            </div>
            {_.isEmpty(link) || (
              <Button
                label={link.title}
                url={link.url}
                variant="primaryMercury"
                text="lg:w-[353px] w-[250px] !bg-[#f2f2f2] !border-[#f2f2f2] tractors-cta-card-link"
              />
            )}
          </div>
        </motion.div>
      </BoxedContainer>
    </section>
  );
}
