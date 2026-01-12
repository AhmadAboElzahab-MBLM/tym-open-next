import React from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import BoxedContainer from './layout/boxed-container';
import Icons from './layout/icons';

export default function PageBannerWithIconList({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const items = _.get(data, 'properties.items.items', {});

  return (
    <section id={id} className="bg-white pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex max-w-[832px] flex-col gap-y-[15px] md:gap-y-[20px] lg:gap-y-[32px]">
          {_.isEmpty(title) || (
            <div
              className="text-clamp32to48  font-bold uppercase leading-1.125
          text-[#000] lg:leading-[54px]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {_.isEmpty(text) || (
            <div
              className="flex flex-col gap-y-[15px] font-noto text-[12px]
          font-normal leading-1.625 text-[#000]  md:gap-y-[32px] md:text-[15px] md:leading-[26px]
          lg:text-[18px] lg:leading-[32px]"
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
            className="flex flex-wrap gap-y-7 pt-6 md:gap-y-[40px] md:pt-[60px]
            lg:gap-y-[80px] lg:pt-[80px]">
            {_.map(items, (item, index) => {
              const itemTitle = _.get(item, 'content.properties.title.markup', '');
              const itemIconName = _.get(item, 'content.properties.iconName', '');

              return (
                <div
                  key={index}
                  className="flex w-[50%] flex-col items-center gap-y-[10px] text-center
                  md:w-[25%] md:gap-y-[20px]">
                  <div className="w-[60px] md:w-[100px]">
                    {_.isEmpty(itemIconName) || (
                      <Icons
                        name={_.upperFirst(itemIconName)}
                        className="h-[60px] w-[60px] md:h-20 md:w-[100px]"
                      />
                    )}
                  </div>
                  {_.isEmpty(itemTitle) || (
                    <div
                      className="font-noto text-[13px] font-bold uppercase tracking-[1.5px]
                      text-black lg:text-[15px]"
                      dangerouslySetInnerHTML={{ __html: itemTitle }}
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </BoxedContainer>
    </section>
  );
}
