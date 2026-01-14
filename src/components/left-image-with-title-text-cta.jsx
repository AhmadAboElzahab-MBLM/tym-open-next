'use client';

import React from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import Button from './layout/button';
import BoxedContainer from './layout/boxed-container';

export default function LeftImageWithTitleTextCta({ data, contentType, lang }) {
  const { image, subtitle, title, text, link, cssClass, paddingBottom, showBottomLine } =
    data.properties;
  const pathname = usePathname();
  const lastSegment = _.last(_.split(pathname, '/'));
  return (
    <section
      id={contentType}
      className={`pt-10 md:pt-[60px] ${paddingBottom ? 'pb-[60px] lg:pb-[140px]' : ''}`}>
      <BoxedContainer>
        <div
          className="flex flex-col items-center gap-x-[30px] gap-y-[30px] md:flex-row
        md:gap-y-0 lg:gap-x-[72px]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}
            className={`w-full
            ${
              cssClass && cssClass.indexOf('smallHeadline') > -1
                ? 'max-w-[600px]'
                : 'max-w-[600px] md:w-[600px]'
            }
            ${lastSegment === 'sam' ? '!w-[700px] !max-w-[700px]' : ''}`}>
            {_.isEmpty(image) || (
              <Image
                src={image[0].url}
                alt={title || image[0].name}
                fill
                className="!relative h-full w-full"
              />
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            viewport={{ once: true }}
            className={`flex flex-col gap-y-[20px] md:gap-y-[36px]
            ${
              cssClass && cssClass.indexOf('smallHeadline') > -1
                ? 'md:max-w-[350px]'
                : 'md:max-w-[448px]'
            }
            ${lastSegment === 'sam' ? '!w-[350px] !max-w-[350px]' : ''}`}>
            <div className="flex flex-col gap-y-[15px] md:gap-y-2">
              <div
                className={`flex flex-col gap-y-3
              ${cssClass && cssClass.indexOf('smallHeadline') > -1 ? 'md:gap-y-2' : 'md:gap-y-8'}`}>
                {cssClass && cssClass.indexOf('smallHeadline') > -1 ? (
                  <>
                    <h5
                      className="font-noto text-[15px] font-bold uppercase tracking-[1.5px]
                text-black">
                      {subtitle}
                    </h5>
                    <h2
                      className="font-noto text-clamp20to28 font-bold uppercase
                      leading-1.5 text-black">
                      {title}
                    </h2>
                  </>
                ) : (
                  <>
                    <h5
                      className="font-noto text-[14px] font-bold uppercase tracking-[1.5px]
                    text-black">
                      {subtitle}
                    </h5>
                    <h2
                      className={`font-sans text-[26px] font-bold uppercase
                      text-black ${lastSegment === 'sam' ? 'text-clamp20to28 leading-1.5' : 'leading-[34px] md:text-[36px] md:leading-[45px] lg:text-[48px] lg:leading-[54px]'}`}>
                      {title}
                    </h2>
                  </>
                )}
              </div>
              {_.isEmpty(text) || (
                <div
                  dangerouslySetInnerHTML={{ __html: text?.markup }}
                  className="font-noto text-clamp12to15 font-normal leading-1.625 text-black
              lg:leading-[24px]"
                />
              )}
            </div>
            {_.isEmpty(link) || (
              <>
                {resolveInternalLinks(link[0], lang)}
                <Button
                  label={link[0].title}
                  url={link[0].url}
                  variant="primaryMercury"
                  text="lg:w-[350px] w-[250px]"
                />
              </>
            )}
          </motion.div>
        </div>
        {showBottomLine ? (
          <div
            className={`${cssClass && cssClass.indexOf('customDivider') > -1 ? '' : 'mt-[40px] md:mt-[60px] lg:mt-[80px]'} 
            h-[1px] w-full bg-cherry`}
          />
        ) : (
          ''
        )}
      </BoxedContainer>
    </section>
  );
}
