import React from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from '@/components/layout/button';
import TitleSection from '@/components/layout/title-section';
import BoxedContainer from '@/components/layout/boxed-container';

export default function ProductDetailsCta({ data }) {
  const title = _.get(data, 'properties.productTitle.markup', '');
  const category = _.get(data, 'properties.category', '');
  const disclaimer = _.get(data, 'properties.productDisclaimer.markup', '');
  const productText = _.get(data, 'properties.productText.markup', '');
  const link = _.get(data, 'properties.productLink[0]', {});
  const image = _.get(data, 'properties.productImage[0]', {});

  return (
    <section id="product-details-cta" className="overflow-hidden">
      <BoxedContainer
        className={`pt-10 lg:pt-12.5
        ${category === 'Attachments' ? 'pb-0 lg:pt-20' : 'lg:pt-25'}
        ${category === 'Rice Transplanters' ? 'mb-[-20px] lg:!pt-[50px]' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-x-5 gap-y-5 md:flex-row md:gap-y-0">
          <div className="flex flex-col gap-y-4 md:max-w-92.5 md:gap-y-9 lg:max-w-112">
            <div className="flex flex-col gap-y-3 md:gap-y-9">
              {_.isNil(title) || <TitleSection data={title} />}
              {_.isNil(productText) || (
                <div
                  className="font-noto text-clamp14to18 leading-1.77 text-primary"
                  dangerouslySetInnerHTML={{ __html: productText }}
                />
              )}
            </div>
            {_.isEmpty(link) || (
              <Button
                url={link?.url || link?.route?.path || '#'}
                target="_blank"
                label={link.title}
                variant="primaryCherry"
                text="!max-w-[240px] product-details-cta"
              />
            )}
            {_.isNil(disclaimer) || (
              <div
                className="max-w-[400px] pt-1 font-noto text-clamp12to15 font-normal
                leading-[160%] text-[#6E6E6D] md:pt-2"
                dangerouslySetInnerHTML={{ __html: disclaimer }}
              />
            )}
          </div>
          <div className="relative w-full 2xl:mr-[-15%]">
            {_.isEmpty(image) || (
              <Image src={image.url} 
              alt={image.name} 
              fill 
              priority
              className="!relative h-full w-full" />
            )}
          </div>
        </motion.div>
      </BoxedContainer>
    </section>
  );
}

