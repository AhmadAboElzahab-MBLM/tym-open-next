import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import _, { isEmpty } from 'lodash';
import formatDate from '@/helpers/format-date';
import Image from 'next/image';
import BoxedContainer from './layout/boxed-container';
import Icons from './layout/icons';

export default function SuccessStoriesDetails({ data }) {
  const { link, title, description, date, image, htmlContent } = data;
  return (
    <section
      id="success-stories-details"
      className="bg-white pb-[60px] pt-[90px] md:pt-[120px] lg:pb-[160px]
      lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col gap-y-[20px] lg:gap-y-[40px]">
          <div className="flex flex-col gap-y-[15px] lg:gap-y-[32px]">
            {isEmpty(link) || (
              <Link
                href={link.url || '#'}
                className="flex items-center gap-2 text-clamp14to15 font-bold leading-1.125">
                <Icons name="ArrowRight" />
                {link.name}
              </Link>
            )}
            <h2 className="max-w-[832px] text-clamp24to48 font-bold uppercase leading-1.125">
              {title}
            </h2>
            <p className="font-noto text-clamp14to15 font-bold uppercase leading-1.75">
              {formatDate(date)}
            </p>
          </div>
          <p className="text-clamp15to18 font-noto font-normal leading-1.75">{description}</p>
        </motion.div>
      </BoxedContainer>
      <BoxedContainer variant="lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          viewport={{ once: true }}
          className="w-full pt-[60px]">
          {_.isEmpty(image) || (
            <Image
              src={image}
              alt={title || image.name}
              fill
              loading="lazy"
              className="!relative !max-h-[48rem] !min-h-[16rem] !object-cover"
            />
          )}
        </motion.div>
      </BoxedContainer>
      <BoxedContainer>
        {_.isEmpty(htmlContent) || (
          <div
            className="flex w-full flex-col gap-y-4 pt-8 font-noto text-clamp16to18 leading-2
        lg:gap-y-8"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </BoxedContainer>
    </section>
  );
}
