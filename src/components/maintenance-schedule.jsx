import React from 'react';
import Image from 'next/image';
import _ from 'lodash';
import { motion } from 'framer-motion';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';

export default function MaintenanceSchedule({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const image = _.get(data, 'properties.image[0]', {});
  const items = _.get(data, 'properties.items.items', []);

  return (
    <section id={id} className="pt-10 md:pt-[80px] lg:pt-[100px]">
      <BoxedContainer>
        <div className="flex flex-col gap-y-6 lg:gap-y-[60px]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex max-w-[832px] flex-col gap-y-4 lg:gap-y-[32px]">
            <TitleSection data={title} />
            {_.isEmpty(text) || (
              <div
                className="flex flex-col gap-y-3 font-noto text-clamp14to18 font-normal
                leading-1.77 text-[#000] ul-child:pl-[25px] li-child:list-disc md:gap-y-[32px]"
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
                const itemTitle = _.get(item, 'content.properties.title.markup', '');
                const itemItems = _.get(item, 'content.properties.items.items', []);

                if (index === 0) {
                  return (
                    <div
                      key={index}
                      className="mb-[20px] flex flex-col gap-x-[110px] gap-y-3 border
                      border-grey px-[15px] pb-[20px] pt-[15px] md:mb-[40px] md:flex-row md:px-[22px]
                      md:pb-[36px] md:pt-[22px] lg:gap-y-[15px]">
                      {_.isEmpty(itemTitle) || (
                        <div
                          className="min-w-[60px] font-noto font-bold leading-[30px] text-primary"
                          dangerouslySetInnerHTML={{ __html: itemTitle }}
                        />
                      )}

                      <div className="flex flex-row gap-x-[234px]">
                        {_.map(itemItems, (subItem, index1) => {
                          const subItemTitle = _.get(subItem, 'content.properties.title', '');
                          const subItemSublist = _.get(subItem, 'content.properties.sublist', []);
                          return (
                            <div
                              key={index1}
                              className="flex flex-col gap-y-[10px] md:gap-y-[16px]">
                              <h2
                                className="min-w-[60px] font-noto text-[15px] font-bold
                              leading-[30px] text-primary lg:text-[18px]">
                                {subItemTitle}
                              </h2>
                              <div
                                className="flex flex-row flex-wrap justify-between gap-x-[20px]
                              gap-y-3 md:gap-x-[60px] lg:gap-x-[103px] lg:gap-y-[20px]">
                                {_.chunk(subItemSublist, 4).map((column, columnIndex) => (
                                  <div key={columnIndex} className="flex flex-col gap-y-[4px]">
                                    {_.map(column, (innerSubItem, index2) => (
                                      <p
                                        key={index2}
                                        className="font-noto text-clamp12to15 font-normal
                                        leading-[24px] text-primary">
                                        {innerSubItem}
                                      </p>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className="flex flex-col gap-x-[110px] gap-y-3 border-l border-r
                    border-t border-l-grey border-r-grey border-t-grey px-[15px] pb-[20px]
                    pt-[15px] last:border-b last:border-b-grey odd:bg-porcelain md:flex-row md:px-[22px] md:pb-[36px]
                    md:pt-[22px] lg:gap-y-[15px]">
                    {_.isEmpty(itemTitle) || (
                      <div
                        className="min-w-[60px] font-noto font-bold leading-[30px] text-primary"
                        dangerouslySetInnerHTML={{ __html: itemTitle }}
                      />
                    )}

                    <div
                      className="flex flex-col gap-y-[15px] md:flex-row md:gap-x-[100px]
                      lg:gap-x-[234px]">
                      {_.map(itemItems, (subItem, index1) => {
                        const subItemTitle = _.get(subItem, 'content.properties.title', '');
                        const subItemSublist = _.get(subItem, 'content.properties.sublist', []);

                        return (
                          <div
                            key={index1}
                            className="flex w-full flex-col gap-y-[5px] md:w-[200px] md:gap-y-[16px]
                            lg:w-[250px]">
                            <h2
                              className="min-w-[60px] font-noto text-[15px] font-bold
                              leading-[30px] text-primary lg:text-[18px]">
                              {subItemTitle}
                            </h2>
                            <div className="flex flex-row gap-3 md:justify-between">
                              {_.map(subItemSublist, (innerSubItem, index2) => (
                                <p
                                  key={index2}
                                  className="font-noto text-clamp12to15 font-normal leading-[24px]
                                  text-primary">
                                  {innerSubItem}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </BoxedContainer>
      {_.isEmpty(image) || (
        <div className="pt-[30px] md:pt-[60px] lg:pt-[100px]">
          <Image src={image.url} alt={image.name} fill className="!relative h-full w-full" />
        </div>
      )}
    </section>
  );
}
