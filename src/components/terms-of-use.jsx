import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BoxedContainer from './layout/boxed-container';
import Icons from './layout/icons';

export default function TermsOfUse({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const items = _.get(data, 'properties.items', []);
  const disclaimer = _.get(data, 'properties.disclaimer.markup', '');

  const [openIndexes, setOpenIndexes] = useState([]);

  useEffect(() => {
    const initialOpenIndexes = items?.items?.map((group) => 0);
    setOpenIndexes(initialOpenIndexes);
  }, [items]);
  if (_.isEmpty(items)) return null;

  const toggleAccordion = (groupIndex, itemIndex) => {
    setOpenIndexes((prevOpenIndexes) => {
      const isItemOpen = prevOpenIndexes[groupIndex] === itemIndex;
      if (isItemOpen) {
        return {
          ...prevOpenIndexes,
          [groupIndex]: null,
        };
      }
      return {
        ...prevOpenIndexes,
        [groupIndex]: itemIndex,
      };
    });
  };

  return (
    <section
      id={id}
      className="relative bg-white pb-[90px] pt-[90px] md:pb-[120px]
      md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <div className="flex flex-col gap-y-7 md:gap-y-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex max-w-[864px] flex-col gap-y-[15px] md:gap-y-[20px] lg:gap-y-[32px]">
            {_.isEmpty(title) || (
              <div
                className="text-[26px] font-bold uppercase leading-[34px] text-primary
              md:text-[36px] md:leading-[45px] lg:text-[48px] lg:leading-[54px]"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {_.isEmpty(text) || (
              <div
                className="flex flex-col gap-y-4 font-noto text-[15px]
              font-normal leading-[26px] text-black p-span-child:font-bold p-span-child:text-cherry lg:gap-y-8 lg:text-[18px]
              lg:leading-[32px]"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </motion.div>

          {_.isEmpty(items) || (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              viewport={{ once: true }}
              className="flex flex-col gap-y-7 md:gap-y-10">
              {_.map(items.items, (group, groupIndex) => {
                const groupHeader = _.get(group, 'content.properties.groupHeader.markup', '');
                const groupItems = _.get(group, 'content.properties.groupItems.items', null);
                return (
                  <div key={groupIndex} className="flex flex-col">
                    <div
                      className="pb-3 font-noto text-[15px] font-bold
                    text-cherry md:pb-5 lg:text-[18px] lg:leading-[32px]"
                      dangerouslySetInnerHTML={{
                        __html: groupHeader,
                      }}
                    />
                    {_.map(groupItems, (groupItem, itemIndex) => {
                      const groupItemHeader = _.get(groupItem, 'content.properties.title', '');
                      const groupItemText = _.get(groupItem, 'content.properties.text.markup', '');
                      return (
                        <div
                          key={itemIndex}
                          className="border border-grey border-b-transparent pb-4 pl-5 pr-5
                         pt-4 last:border-b-grey md:pb-6 md:pl-7 md:pr-[35px] md:pt-5">
                          <button
                            type="button"
                            onClick={() => toggleAccordion(groupIndex, itemIndex)}
                            className="flex w-full flex-row items-center justify-between
                            font-noto text-[16px] font-bold leading-[32px] text-primary md:text-[18px]">
                            <span>{groupItemHeader}</span>
                            <span>
                              <Icons
                                name={
                                  openIndexes[groupIndex] === itemIndex
                                    ? 'AccordionOpen'
                                    : 'AccordionClose'
                                }
                              />
                            </span>
                          </button>
                          {openIndexes[groupIndex] === itemIndex && (
                            <div
                              className="flex flex-col gap-y-2 pb-2 pt-3
                              font-noto text-[13px] font-normal
                              leading-[18px] text-primary ol-child:flex ol-child:flex-col ol-child:gap-1
                              ol-child:pl-4 ol-li-child:list-decimal ol-li-inner-child:flex ol-li-inner-child:flex-col ol-li-inner-child:gap-1
                              ol-li-inner-child:pl-5 ol-li-inner-child:pt-2 md:pt-5
                              md:text-[15px] md:leading-[24px]"
                              dangerouslySetInnerHTML={{
                                __html: groupItemText,
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </motion.div>
          )}

          {_.isEmpty(disclaimer) || (
            <div
              className="flex flex-col gap-y-2 font-noto text-[15px]
              font-normal leading-[26px] text-black p-span-child:font-bold p-span-child:text-cherry ul-child:pl-4
              li-child:list-disc lg:text-[18px] lg:leading-[32px]"
              dangerouslySetInnerHTML={{ __html: disclaimer }}
            />
          )}
        </div>
      </BoxedContainer>
    </section>
  );
}
