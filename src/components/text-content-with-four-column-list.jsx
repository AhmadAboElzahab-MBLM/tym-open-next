'use client';

import React from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';

export default function TextContentWithFourColumnList({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const disclaimer = _.get(data, 'properties.disclaimer.markup', '');
  const items = _.get(data, 'properties.items.items', []);
  const isTop = _.get(data, 'properties.isTop', false);

  return (
    <section
      id={id}
      className={`${
        isTop ? 'pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]' : 'pt-10 md:pt-[80px]'
      } overflow-hiddens`}>
      <BoxedContainer>
        <div className="flex flex-col gap-y-[20px] pb-10 md:pb-[80px] lg:gap-y-[32px]">
          <div className="flex flex-col gap-y-[30px] md:gap-y-[40px] lg:gap-y-[60px]">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center gap-y-2 text-center
              lg:gap-y-[32px]">
              <TitleSection data={title} className="max-w-[480px]" />
              {_.isEmpty(text) || (
                <div
                  className="flex max-w-[809px] flex-col gap-y-[15px] font-noto text-clamp14to18
                  font-normal leading-1.77 text-[#000] md:gap-y-[32px]"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              )}
            </motion.div>
            {_.isEmpty(items) || (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-nowrap gap-[12px] overflow-auto md:flex-wrap
                md:gap-[12px] lg:gap-[32px]">
                {_.map(items, (val, index) => {
                  const items2 = _.get(val, 'content.properties.items.items', []);
                  return index === 0 ? (
                    <div
                      key={index}
                      className="sticky left-0
                      top-0 flex min-w-[170px]
                      flex-col gap-y-2 bg-white pt-4 md:w-[calc(25%-10px)] md:gap-y-[30px]
                      md:pb-[70px] md:pt-[20px] lg:w-[calc(25%-24px)] lg:gap-y-[60px]">
                      {_.map(items2, (val2, index1) => {
                        const val2Title = _.get(val2, 'content.properties.title', '');
                        const val2Text = _.get(val2, 'content.properties.text', '');
                        const minHeightList = _.get(val2, 'content.properties.minHeightList', '');

                        return (
                          <div
                            key={index1}
                            className="flex flex-col gap-y-1 md:gap-y-[12px]
                          "
                            style={{ minHeight: minHeightList }}>
                            {_.isEmpty(val2Title) || (
                              <h5
                                className="font-noto text-[15px] font-bold leading-[25px]
                                text-cherry lg:text-[18px] lg:leading-[30px]">
                                {val2Title}
                              </h5>
                            )}

                            <p
                              className="font-noto text-clamp12to15 font-normal leading-1.625
                              text-primary">
                              {val2Text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="flex min-w-[200px]
                      flex-col gap-y-3 border
                      border-grey p-4 md:w-[calc(25%-10px)] md:gap-y-[30px] md:px-[20px]
                      md:pb-[20px] md:pt-[20px] lg:w-[calc(25%-24px)] lg:gap-y-[60px]">
                      {_.map(items2, (val2, index1) => {
                        const val2Title = _.get(val2, 'content.properties.title', '');
                        const val2Text = _.get(val2, 'content.properties.text', '');
                        const minHeightList = _.get(val2, 'content.properties.minHeightList', '');
                        return (
                          <div
                            key={index1}
                            className="flex flex-col gap-y-1.5 md:gap-y-[12px]"
                            style={{ minHeight: minHeightList }}>
                            {_.isEmpty(val2Title) || (
                              <h5
                                className="font-noto text-[15px] font-bold leading-[25px]
                                text-primary lg:text-[18px] lg:leading-[30px]">
                                {val2Title}
                              </h5>
                            )}

                            <p
                              className="font-noto text-clamp12to15 font-normal leading-1.625
                              text-primary">
                              {val2Text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>
          {_.isEmpty(disclaimer) || (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col gap-y-3 font-noto text-clamp12to15 font-normal
          text-primary p-child:text-clamp12to15 p-child:font-bold p-child:uppercase p-child:tracking-[1.5px]
          p-child:text-cherry ol-child:flex ol-child:flex-col ol-child:gap-y-2
          ol-child:pl-[17px] ol-li-child:list-decimal md:gap-y-[22px] ol-child:md:gap-y-[32px]
          lg:leading-[25px]"
              dangerouslySetInnerHTML={{ __html: disclaimer }}
            />
          )}
        </div>
        <div className="h-[1px] w-full bg-cherry" />
      </BoxedContainer>
    </section>
  );
}
