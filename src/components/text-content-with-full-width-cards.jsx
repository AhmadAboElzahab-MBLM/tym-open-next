import React from 'react';
import Image from 'next/image';
import _ from 'lodash';
import { motion } from 'framer-motion';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';
import Button from './layout/button';

export default function TextContentWithFullWidthCards({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const link = _.get(data, 'properties.link[0]', {});
  const textRight = _.get(data, 'properties.textRight', null);
  const items = _.get(data, 'properties.items.items', []);

  return (
    <section id={id} className="pt-10 md:pt-[80px] pb-[40px]">
      <BoxedContainer>
        <div className="flex flex-col gap-y-[30px] md:gap-y-[40px] lg:gap-y-[60px]">
          {textRight ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col gap-y-[12px]">
              <TitleSection data={title} className="max-w-[544px] !text-[#000]" />
              {_.isEmpty(text) || (
                <div
                  className="max-w-[736px] pt-[3px] font-noto text-clamp14to18 font-normal
                  leading-1.77 text-primary lg:pt-[16px]"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              )}

              {_.isEmpty(link) || (
                <div>
                  <Button
                    url={link.url}
                    label={link.title}
                    varient="primaryText"
                    rightArrow="ArrowRight"
                    text="!p-0 !min-h-0 !gap-x-2 md:gap-x-[17px] !text-cherry svg-child-path:!stroke-cherry
                    !font-bold !text-[12px] md:!text-[15px] font-noto"
                  />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-y-[12px] text-center">
              <TitleSection data={title} className="max-w-[502px] !text-[#000]" />
              {_.isEmpty(text) || (
                <div
                  className="max-w-[809px] pt-[3px] font-noto text-clamp14to18 font-normal
                  leading-1.77 text-[#000] lg:pt-[20px]"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              )}

              {_.isEmpty(link) || (
                <div>
                  <Button
                    url={link.url}
                    label={link.title}
                    varient="primaryText"
                    rightArrow="ArrowRight"
                    text="!p-0 !min-h-0 !gap-x-2 md:gap-x-[17px] !text-cherry svg-child-path:!stroke-cherry !font-medium
                    !text-[12px] md:!text-[16px] full-width-cards-link"
                  />
                </div>
              )}
            </motion.div>
          )}

          {_.isEmpty(items) || (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col gap-y-[15px] md:gap-y-0">
              {_.map(items, (item, index) => {
                const itemTitle = _.get(item, 'content.properties.title', '');
                const itemText = _.get(item, 'content.properties.text.markup', '');
                const itemImage = _.get(item, 'content.properties.image[0]', {});

                return (
                  <div
                    key={index}
                    className="flex min-h-[240px] flex-col-reverse justify-between border
                    border-grey last:border-b last:border-b-grey md:flex-row md:border-b-[0px]
                  md:border-l md:border-t md:border-[auto] md:border-b-[transparent]
                  md:border-b-grey md:border-l-grey md:border-r-grey md:border-t-grey">
                    <div
                      className="flex flex-col gap-y-2 py-[20px] pl-[20px]
                  pr-[20px] md:max-w-[50%] lg:gap-y-[20px] lg:py-[40px] lg:pl-[40px] lg:pr-[70px]">
                      <h3
                        className="text-center font-noto text-[16px] font-bold
                    leading-[26px] text-primary md:text-left md:text-[18px] md:leading-[32px]">
                        {itemTitle}
                      </h3>
                      {_.isEmpty(itemText) || (
                        <div
                          className="flex flex-col gap-y-[10px] text-center
                      font-noto text-clamp12to15 font-normal leading-1.625 text-primary
                      md:text-left lg:gap-y-[20px] lg:leading-[24px]"
                          dangerouslySetInnerHTML={{ __html: itemText }}
                        />
                      )}
                    </div>
                    <div className="relative w-full md:max-w-[50%]">
                      {_.isEmpty(itemImage) || (
                        <Image
                          src={`${itemImage.url}?width=560&height=240&mode=crop`}
                          width={560}
                          height={240}
                          alt={itemImage.name}
                          className="!relative h-full w-full border-b border-b-grey object-cover md:border-b-0 md:border-l md:border-l-grey"
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
