import React from 'react';
import _, { get } from 'lodash';
import Image from 'next/image';
import { motion } from 'framer-motion';
import BoxedContainer from '../layout/boxed-container';

export default function TwoColumnImageContentSet({ data, id }) {
  const contentItems = get(data, 'properties.items.items', []);

  return (
    <section
      id={id}
      className={`bg-white py-15 font-noto
               text-clamp12to15 
               leading-[24px] text-primary`}>
      <BoxedContainer>
        {_.isEmpty(contentItems) || (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col gap-y-[15px] md:gap-y-0">
            {_.map(contentItems, (item, index) => {
              const itemTitle = _.get(item, 'content.properties.title', '');
              const caption = _.get(item, 'content.properties.caption.markup', '');
              const itemImage = _.get(item, 'content.properties.image[0]', {});

              return (
                <div
                  key={index}
                  className="flex min-h-[240px] flex-col justify-between border
                    border-grey last:border-b last:border-b-grey md:flex-row md:border-b-[0px]
                  md:border-l md:border-t md:border-[auto] md:border-b-[transparent]
                  md:border-b-grey md:border-l-grey md:border-r-grey md:border-t-grey">
                  <div className="relative w-full md:!w-1/2">
                    {_.isEmpty(itemImage) || (
                      <Image
                        src={`${itemImage.url}?width=560&height=240&mode=crop`}
                        alt={itemImage.name}
                        fill
                        className="!relative h-full w-full border-b border-b-grey
                                   object-cover md:border-b-0 md:border-l md:border-l-grey"
                      />
                    )}
                  </div>
                  <div
                    className="flex flex-col gap-y-2 py-[20px]
                  pl-[20px] pr-[20px] md:w-1/2 lg:gap-y-[20px] lg:py-[40px] lg:pl-[40px] lg:pr-[70px]">
                    <h3
                      className="text-center font-noto text-[16px] font-bold
                    leading-[26px] text-primary md:text-left md:text-[18px] md:leading-[32px]">
                      {itemTitle}
                    </h3>
                    {_.isEmpty(caption) || (
                      <div
                        className="flex flex-col gap-y-[10px] text-center
                      font-noto text-clamp12to15 font-normal leading-1.625 text-primary
                      md:text-left lg:gap-y-[20px] lg:leading-[24px]"
                        dangerouslySetInnerHTML={{ __html: caption }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </BoxedContainer>
    </section>
  );
}
