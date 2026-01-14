import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import _ from 'lodash';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import GlobalContext from '@/context/global-context';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import BoxedContainer from './layout/boxed-container';

export default function QuickLinks({ data }) {
  const { lang } = useContext(GlobalContext);
  const title = _.get(data, 'properties.title', '');
  const quickLinks = _.get(data, 'properties.items', []);
  const pathname = usePathname();
  const lastSegment = _.last(_.split(pathname, '/'));

  if (_.isEmpty(quickLinks)) return null;
  return (
    <section
      id="quick-link"
      className={` pt-10 md:pt-[80px]
    ${lastSegment === 'support-faqs' ? '' : 'pb-10 md:pb-[80px] lg:pb-[140px]'}
    ${lastSegment === 'parts-support' ? 'md:!pb-[60px] md:!pt-[48px]' : ''}
    ${lastSegment === 'faqs' ? '!pb-0' : ''}`}>
      <BoxedContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col gap-y-5">
          <h3
            className="font-noto text-clamp14to15 font-bold uppercase tracking-widest text-[#000]
            ">
            {title}
          </h3>
          <div className="flex flex-wrap gap-y-6 md:gap-x-8 md:gap-y-[60px]">
            {!_.isEmpty(quickLinks.items) &&
              _.map(
                quickLinks.items,
                (item, index) =>
                  !_.isEmpty(item.content.properties.link) && (
                    <>
                      {resolveInternalLinks(item.content.properties.link[0], lang)}
                      <Link
                        href={item.content.properties.link[0].url || '#'}
                        key={index}
                        className="quick-link flex flex-col gap-y-2 md:w-[calc(33.3333%-22px)]
                        md:gap-y-5">
                        <div className="w-full md:h-auto md:min-h-52">
                          {!_.isEmpty(item.content.properties) && (
                            <Image
                              src={_.get(item, 'content.properties.image[0].url', '')}
                              alt={item.content.properties.title}
                              fill
                              className="!relative h-full max-h-[210px] w-full object-cover"
                            />
                          )}
                        </div>
                        <div
                          className="flex w-full flex-col gap-y-2.5 px-3 md:gap-y-5 md:px-5 md:pb-5
            ">
                          <h4
                            className="line-clamp-2 font-noto text-[16px] font-bold
              leading-[26px] text-primary md:text-[18px] md:leading-[30px]">
                            {item.content.properties.title}
                          </h4>
                          {!_.isEmpty(item.content.properties.text) && (
                            <div
                              className="line-clamp-3 font-noto text-clamp12to15 font-normal
                leading-1.625 text-primary md:leading-[24px]"
                              dangerouslySetInnerHTML={{
                                __html: item.content.properties.text.markup,
                              }}
                            />
                          )}
                        </div>
                      </Link>
                    </>
                  ),
              )}
          </div>
        </motion.div>
      </BoxedContainer>
    </section>
  );
}
