import React from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import Image from 'next/image';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';
import Button from './layout/button';

export default function TextContentCTAWithBgImage({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const link = _.get(data, 'properties.link[0]', {});
  const image = _.get(data, 'properties.image[0]', {});

  return (
    <section id={id} className="pt-5 md:pt-[80px] lg:pt-[100px]">
      <BoxedContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[928px] flex-col gap-y-[20px] lg:gap-y-[40px]">
          <div className="flex flex-col gap-y-[10px] text-center lg:gap-y-[20px]">
            <TitleSection data={title} />
            {_.isEmpty(text) || (
              <div
                className="font-noto text-clamp14to18 font-normal leading-[177%] text-primary"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
          {!_.isEmpty(link) && (
            <Button
              url={link.url}
              label={link.title}
              variant="primaryText"
              text="!whitespace-normal text-content-cta-button"
              rightArrow="ArrowRight"
            />
          )}
        </motion.div>
      </BoxedContainer>
      {_.isEmpty(image) || (
        <div className="pt-[30px] md:pt-[40px] lg:pt-[80px]">
          <Image src={image.url} alt={image.name} fill className="!relative h-full w-full" />
        </div>
      )}
    </section>
  );
}
