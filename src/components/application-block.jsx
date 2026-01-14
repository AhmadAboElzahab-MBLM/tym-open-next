import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import _ from 'lodash';
import Image from 'next/image';
import Icons from '@/components/layout/icons';
import useHoverCursor from '@/hooks/use-hover-cursor';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';

export default function ApplicationBlock({ data, id }) {
  const title = _.get(data, 'properties.applicationTitle.markup', '');
  const text = _.get(data, 'properties.applicationText.markup', '');
  const isCenter = _.get(data, 'properties.isCenter', '');
  const items = _.get(data, 'properties.application.items', []);
  const isMarkupValid = (markup) => markup !== '<p>[object Object]</p>';
  const { toggleCursor } = useHoverCursor();

  useEffect(() => {
    toggleCursor(false);
    return () => toggleCursor(false);
  }, []);

  // if (_.isEmpty(title && text && items)) return null;

  return (
    <section id={id} className="relative z-10 bg-white">
      <BoxedContainer>
        <div className={`flex flex-col pt-[40px] md:pt-[60px] 
          ${items.length > 0 ? "gap-y-5 lg:gap-y-[60px]" : ""}`}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className={`flex flex-col gap-y-3 lg:gap-y-[32px] ${isCenter ? 'items-center' : ''}`}>
            {_.isEmpty(title) || !isMarkupValid(title) || (
              <TitleSection data={title} className="max-w-[544px]" />
            )}
            {_.isEmpty(text) || !isMarkupValid(text) || (
              <div
                className={`flex flex-col gap-y-2 font-noto text-clamp14to18 font-normal
            leading-1.77 text-[#000] lg:gap-y-[32px] ${
              isCenter ? 'max-w-[809px] text-center' : 'max-w-[928px]'
            }`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap">
            {_.map(items, (item, index) => {
              const itemTitle = _.get(item, 'content.properties.title', '');
              const itemText = _.get(item, 'content.properties.text.markup', '');
              const applicationText = _.get(item, 'content.properties.text', '');
              const itemIcon = _.get(item, 'content.properties.icon', '');
              const itemImage = _.get(item, 'content.properties.image[0]', null);
              return (
                <div
                  key={index}
                  onMouseEnter={() => toggleCursor(true)}
                  onMouseLeave={() => toggleCursor(false)}
                  className="group relative min-h-[300px] w-full overflow-hidden border-t
                  border-t-white bg-grey md:min-h-[450px] md:w-[50%] md:border-l
                  md:border-l-white hover:md:cursor-pointer">
                  {_.isEmpty(itemImage) || (
                    <Image
                      src={itemImage.url}
                      alt={itemImage.name}
                      fill
                      className="!z-5 !absolute !h-full !w-full object-cover
                      transition-all duration-600 group-hover:md:scale-110"
                    />
                  )}
                  <div
                    className="relative flex h-full w-full flex-col items-center
                    justify-center gap-y-4 transition-all duration-600
                    md:gap-y-[28px]">
                    <div
                      className="absolute h-full w-full transition-all duration-600
                      before:absolute before:top-0 before:z-[5] before:!inline
                      before:h-full before:w-full before:bg-primary
                      before:bg-opacity-60 before:content-[''] md:before:!hidden group-hover:md:before:!inline"
                    />
                    {_.isEmpty(itemIcon) || (
                      <div
                        className="z-10 flex h-[60px] w-[60px]
                          items-center justify-center rounded-full
                          bg-white transition-all duration-600 group-hover:h-[60px] group-hover:w-[60px]
                          md:absolute md:h-[85px] md:w-[85px] group-hover:md:!relative
                          group-hover:md:h-[60px] group-hover:md:w-[60px]">
                        <Icons
                          name={itemIcon}
                          className="h-[60px] w-[60px] transition-all duration-600 group-hover:w-[60px]
                          md:h-[85px]
                          md:w-[85px] group-hover:md:h-[60px] group-hover:md:w-[60px]"
                        />
                      </div>
                    )}
                    <div
                      className="z-10 mx-auto flex
                        flex-col gap-y-[10px] px-4 text-center transition-all duration-600
                        md:w-[371px] md:translate-y-[400%] md:gap-y-[28px] md:px-0 group-hover:md:translate-y-0">
                      <h3
                        className="upeprcase font-noto text-[15px] font-bold uppercase
                        leading-[24px] tracking-[1.5px] text-white">
                        {itemTitle}
                      </h3>
                      {_.isEmpty(itemText) || (
                        <div
                          className="font-noto text-clamp12to15 font-normal leading-[24px]
                          text-white"
                          dangerouslySetInnerHTML={{ __html: itemText }}
                        />
                      )}

                      {_.isEmpty(applicationText) || (
                        <p
                          className="font-noto text-clamp12to15 font-normal leading-1.625
                            text-white md:leading-[24px]" dangerouslySetInnerHTML={{ __html: applicationText}} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </BoxedContainer>
    </section>
  );
}
