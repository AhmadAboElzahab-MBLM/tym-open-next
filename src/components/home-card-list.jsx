'use client';

import React from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';

export default function HomeCardList({ data, id, lang }) {
  const title = _.get(data, 'properties.title.markup');
  const items = _.get(data, 'properties.items.items');

  return (
    <section id={id} className="py-10 lg:py-[120px]">
      <BoxedContainer>
        <div className="flex flex-col gap-y-5 md:gap-y-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}>
            <TitleSection data={title} />
          </motion.div>
          {_.isEmpty(items) || (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-2">
              {_.map(items, (item, index) => {
                const val = item.content.properties;
                const valLink = item?.content?.properties?.link?.[0];
                if (valLink) {
                  resolveInternalLinks(valLink, lang);
                }
                return (
                  _.isEmpty(val.link) || (
                    <div
                      key={index}
                      className="home-card-list-links group relative flex h-[400px] w-full flex-col gap-y-2 overflow-hidden xs:gap-y-4 md:h-[600px] md:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-6px)]">
                      <div
                        className="absolute bottom-0 left-0 right-0 top-0 z-[5] h-full w-full"
                        style={{
                          background:
                            'linear-gradient(180deg,rgba(0, 0, 0,0.50 ) 4%, rgba(237, 221, 83, 0) 24%)',
                        }}
                      />
                      {!_.isEmpty(val.image) && (
                        <Image
                          src={val.image[0].url}
                          alt={val.image[0].name}
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="!absolute !h-full !w-full !object-cover transition-all duration-700 group-hover:md:scale-110"
                        />
                      )}
                      <div className="relative z-10 flex h-full flex-col justify-between gap-y-1 p-4 md:gap-y-0.5 md:p-7">
                        <div className="flex flex-col gap-2">
                          <h4 className="font-sans text-[22px] font-bold leading-1.25 text-white md:text-[28px]">
                            {val.title}
                          </h4>

                          {val.description && (
                            <p className="font-noto text-[18px] font-bold leading-1.25 text-white md:text-[21px]">
                              {val.description}
                            </p>
                          )}

                          {val.valueMetric && (
                            <p className="font-noto text-[18px] font-bold leading-1.25 text-white md:text-[21px]">
                              {val.valueMetric}
                            </p>
                          )}
                        </div>
                        {_.isEmpty(val.link) || (
                          <Link
                            href={`${valLink?.url || '#'}${valLink?.queryString || ''}`}
                            className="home-card-list-button flex w-fit justify-center whitespace-pre border-none bg-cherry px-6 py-3 text-[12px] font-bold uppercase leading-1.625 text-white hover:bg-paprika hover:text-white">
                            {valLink?.title}
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                );
              })}
            </motion.div>
          )}
        </div>
      </BoxedContainer>
    </section>
  );
}
