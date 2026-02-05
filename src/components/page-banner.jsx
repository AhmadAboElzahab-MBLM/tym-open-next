import React from 'react';
import { map, get, isEmpty, includes } from 'lodash';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import BoxedContainer from './layout/boxed-container';
import Button from './layout/button';

export default function PageBanner({ data, id }) {
  const title = get(data, 'properties.title.markup', '');
  const text = get(data, 'properties.text.markup', '');
  const image = get(data, 'properties.image[0]', {});
  const classname = get(data, 'properties.classname', '');
  const hideGradient = get(data, 'properties.hideGradient', '');
  const keyStats = get(data, 'properties.keyStats.items', []);
  const productLink = get(data, 'properties.productLink[0]', {});
  const path = usePathname();
  const isDave = includes(path, 'ko/technology/dave');
  const isSam = includes(path, 'ko/technology/sam');

  return (
    <section id={id} className="bg-white pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className={`flex flex-col gap-y-3 md:gap-y-[20px] lg:gap-y-[32px] ${
            classname === 'series_banner' ? 'max-w-[832px]' : 'max-w-[736px]'
          }`}>
          {isEmpty(title) || (
            <div
              className={`text-clamp32to48 font-bold uppercase leading-[112%] text-[#000] ${isDave || isSam ? 'h3-child:!font-sans' : ''}`}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {isEmpty(text) || (
            <div
              className="font-noto text-clamp14to18 font-normal leading-[177%] text-[#000]"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </motion.div>
      </BoxedContainer>
      {isEmpty(image) || (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className={`relative mx-auto mt-[20px] md:mt-[40px] ${
            classname === 'series_banner'
              ? 'max-w-[1520px] lg:mt-[40px]'
              : 'max-w-[1520px] lg:mt-[64px]'
          } `}>
          <Image
            src={image.url}
            alt={image.name}
            fill
            className="h-fulll !relative min-h-[230px] w-full object-cover lg:min-h-[542px]"
          />
          {hideGradient ? (
            <div className="absolute bottom-0 left-0 right-0 top-0 z-[5] h-full w-full" />
          ) : (
            <div
              className="absolute bottom-0 left-0 right-0 top-0 z-[5] h-full w-full"
              style={{
                background:
                  'linear-gradient(360deg,rgba(0, 0, 0,0.4 ) 10%, rgba(237, 221, 83, 0) 24%)',
              }}
            />
          )}
          {isEmpty(productLink) || (
            <Button
              label={productLink.title}
              url={`${productLink.url}`}
              target={productLink.target}
              variant="primaryCherry"
              text="!w-[250px] !min-h-[40px] !h-[40px] !text-[13px] z-[10] absolute
              top-4 left-4 lg:top-10 lg:left-15 page-banner-button"
            />
          )}

          {isEmpty(keyStats) || (
            <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-6 pt-2 md:pt-4 lg:bottom-10 lg:left-15 lg:gap-12 lg:pt-0 xl:gap-20">
              {map(keyStats, (val, index) => {
                const keyValue = get(val, 'content.properties.keyValue', '');
                const keyStat = get(val, 'content.properties.keyStat', '');

                return (
                  <div key={index} className="flex flex-col gap-1 font-noto lg:gap-2">
                    <span className="text-clamp16to21 font-bold leading-1.125 text-white">
                      {keyValue}
                    </span>
                    <span className="text-clamp14to18 leading-1.77 text-white">{keyStat}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
