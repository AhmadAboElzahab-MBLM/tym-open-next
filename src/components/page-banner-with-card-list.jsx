import React from 'react';
import { motion } from 'framer-motion';
import _ from 'lodash';
import Image from 'next/image';
import BoxedContainer from './layout/boxed-container';

export default function PageBannerWithCardList({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const items = _.get(data, 'properties.items.items', []);
  const disclaimer = _.get(data, 'properties.disclaimer.markup', '');

  return (
    <section id={id} className="bg-white pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <div className="flex flex-col gap-y-5 md:gap-y-[48px]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex max-w-[832px] flex-col gap-y-[15px] md:gap-y-[20px] lg:gap-y-[32px]">
            {_.isEmpty(title) || (
              <div
                className="max-w-[780px] text-clamp32to48 font-bold uppercase
               leading-1.125 text-[#000] md:leading-[45px] lg:leading-[54px]"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {_.isEmpty(text) || (
              <div
                className="flex flex-col gap-y-2 font-noto text-[12px]
            font-normal leading-1.625 text-[#000] md:gap-y-[32px] md:text-[15px] lg:text-[18px]
            lg:leading-[32px]"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </motion.div>
          {_.isEmpty(items) || (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              viewport={{ once: true }}>
              {_.map(items, (item, index) => {
                const itemTitle = _.get(item, 'content.properties.title', '');
                const itemText = _.get(item, 'content.properties.text.markup', '');
                const itemImage = _.get(item, 'content.properties.image[0]', {});
                return (
                  <div
                    key={index}
                    className="flex flex-col-reverse border-l border-r border-t
                  border-l-grey border-r-grey border-t-grey last:border-b last:border-b-grey
                  md:flex-row">
                    <div
                      className="flex flex-col gap-y-[5px] pb-[20px] pl-[20px]
                    pr-[20px] pt-[20px] md:w-[50%] md:gap-y-[12px] lg:pb-[50px] lg:pl-[40px]
                    lg:pr-[70px] lg:pt-[40px]">
                      <h5
                        className="font-noto text-[16px] font-bold leading-[26px]
                    text-primary md:text-[18px] md:leading-[30px]">
                        {itemTitle}
                      </h5>
                      {_.isEmpty(itemText) || (
                        <div
                          className="font-noto text-[12px] font-normal leading-1.625 text-primary
                      md:text-[15px] md:leading-[24px]"
                          dangerouslySetInnerHTML={{ __html: itemText }}
                        />
                      )}
                    </div>
                    <div className="md:w-[50%]">
                      {_.isEmpty(itemImage) || (
                        <Image
                          src={itemImage.url}
                          alt={itemImage.name}
                          fill
                          className="!relative h-full w-full"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
          {_.isEmpty(disclaimer) || (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className="max-w-[736px] font-noto text-clamp14to18 font-bold leading-1.77
              text-[#000]"
              dangerouslySetInnerHTML={{ __html: disclaimer }}
            />
          )}
        </div>
      </BoxedContainer>
    </section>
  );
}
