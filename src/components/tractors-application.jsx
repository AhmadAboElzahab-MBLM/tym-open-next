import React, { useContext } from 'react';
import _ from 'lodash';
import Image from 'next/image';
import { motion } from 'framer-motion';
import resolveTextInternalLinks from '@/helpers/resolve-text-url-locale';
import GlobalContext from '@/context/global-context';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';

export default function TractorsApplication({ data, id }) {
  const { lang } = useContext(GlobalContext);
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const image = _.get(data, 'properties.image[0]', {});
  const items = _.get(data, 'properties.items.items', {});
  const updatedText = resolveTextInternalLinks(text, lang);

  return (
    <section id={id} className='lg:pb-[30px]'>
      <BoxedContainer>
        <div className="h-[1px] w-full bg-cherry" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col gap-y-4 pt-[40px] md:gap-y-[32px] md:pt-[60px] lg:pt-[80px]
          ">
          <div className="max-w-[665px]">
            <TitleSection data={title} />
          </div>
          <div
            className="flex flex-col gap-x-[40px] gap-y-5 md:flex-row md:gap-y-0
            lg:gap-x-[128px]">
            {_.isEmpty(updatedText) || (
              <div
                className="flex max-w-[736px] flex-col gap-y-3 font-noto
                text-clamp14to18 font-normal leading-1.77 text-black a-child:underline
                md:gap-y-[32px] a-child:font-bold"
                dangerouslySetInnerHTML={{ __html: updatedText }}
              />
            )}

            {_.isEmpty(items) || (
              <div className="flex flex-col gap-y-3 md:gap-y-[40px]">
                {_.map(items, (item, index) => {
                  const itemTitle = _.get(item, 'content.properties.title', '');
                  const itemText = _.get(item, 'content.properties.text', '');
                  return (
                    <div key={index} className="flex flex-col md:w-[222px] md:gap-y-2">
                      <h2
                        className="font-sans text-[24px] font-bold uppercase leading-[36px]
                        text-granite md:text-[32px] md:leading-[42px]
                          lg:text-[48px] lg:leading-[54px]">
                        {itemTitle}
                      </h2>
                      <p
                        className="font-noto text-[12px] font-normal leading-[26px]
                        text-black lg:text-[18px] lg:leading-[32px]">
                        {itemText}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </BoxedContainer>
      {_.isEmpty(image) || (
        <div className="pt-[30px]">
          <Image src={image.url} alt={id || image.name} fill className="!relative h-full w-full" />
        </div>
      )}
    </section>
  );
}
