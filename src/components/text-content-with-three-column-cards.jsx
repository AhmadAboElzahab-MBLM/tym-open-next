import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import _ from 'lodash';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';

export default function TextContentWithThreeColumnCards({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const items = _.get(data, 'properties.items.items', []);

  return (
    <section id="textContentWithThreeColumnCards" className="pb-[60px] pt-10 md:pb-[80px] lg:pb-[140px] lg:pt-[120px]">
      <BoxedContainer>
        <div className="flex flex-col gap-y-6 md:gap-y-[40px] lg:gap-y-[60px]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col gap-y-3 lg:gap-y-[20px]">
            <TitleSection data={title} className="max-w-[639px] !text-primary" />
            {_.isEmpty(text) || (
              <div
                className="max-w-[928px] pt-[3px] font-noto text-clamp12to18
            font-normal leading-[177%] text-primary lg:leading-[32px]"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </motion.div>
          {_.isEmpty(items) || (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-x-4 gap-y-7 md:gap-x-[32px] md:gap-y-[60px]">
              {_.map(items, (item, index) => {
                const itemTitle = _.get(item, 'content.properties.title', '');
                const itemText = _.get(item, 'content.properties.text.markup', '');
                const itemImage = _.get(item, 'content.properties.image[0]', '');
                return (
                  <div
                    key={index}
                    className="flex w-[calc(50%-8px)] flex-col gap-y-[4px]
                    md:w-[calc(33.3333%-22px)]  md:gap-y-[20px]">
                    <div className="h-[116px] w-full border border-grey md:h-auto md:min-h-[211px]">
                      {_.isEmpty(itemImage) || (
                        <Image
                          src={itemImage.url}
                          alt={itemTitle || itemImage.name}
                          fill
                          className="!relative h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-y-1.5 px-[10px] md:gap-y-[12px] md:px-[20px]">
                      <h4
                        className="font-noto text-[16px] font-bold leading-[26px]
                        text-primary md:text-[18px] md:leading-[30px] ">
                        {itemTitle}
                      </h4>
                      {_.isEmpty(itemText) || (
                        <div
                          className="font-noto text-clamp12to15 font-normal leading-1.625
                       text-primary lg:leading-[24px]"
                          dangerouslySetInnerHTML={{ __html: itemText }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </BoxedContainer>
    </section>
  );
}
