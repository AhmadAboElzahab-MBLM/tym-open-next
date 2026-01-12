import React from 'react';
import BodyLock from '@/components/layout/body-lock';
import BoxedContainer from '@/components/layout/boxed-container';
import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import { AnimatePresence, motion } from 'framer-motion';
import Icons from '@/components/layout/icons';

function HeaderDesktopApplicationsMenu({ data, lang, toggleCursor = () => null }) {
  return (
    <AnimatePresence>
      <BodyLock />
      <BoxedContainer>
        <motion.div
          className="h-screen w-full overflow-y-auto bg-porcelain py-8 4xl:pb-16 4xl:pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseEnter={() => toggleCursor(false)}
          onMouseLeave={() => toggleCursor(true)}
          transition={{ duration: 0.5, ease: 'easeInOut' }}>
          <div
            className="grid grid-cols-1 content-center items-center gap-6 xs:grid-cols-2
            md:grid-cols-4">
            {_.map(data, (item, index) => {
              // console.log(item);
              const itemTitle = _.get(item, 'content.properties.title', '');
              const itemText = _.get(item, 'content.properties.text', '');
              const itemIcon = _.get(item, 'content.properties.icon', '');
              const itemImage = _.get(item, 'content.properties.image[0]', null);
              const link = _.get(item, 'content.properties.link[0]', null);
              resolveInternalLinks(link, lang);
              return (
                _.isEmpty(link) || (
                  <Link
                    href={link.url || '#'}
                    key={index}
                    className="group relative h-[320px] overflow-hidden header-applications-link">
                    {_.isEmpty(itemImage) || (
                      <Image
                        src={itemImage.url}
                        alt={itemImage.name}
                        fill
                        className="!z-5 !absolute !h-full !w-full object-cover transition-all
                      duration-200 group-hover:scale-110"
                      />
                    )}
                    <div
                      className="relative flex h-full w-full flex-col items-center
                    gap-y-5 transition-all duration-200">
                      <div
                        className="absolute h-full w-full transition-all duration-200
                      before:absolute before:top-0 before:z-[5] before:!inline
                      before:h-full before:w-full before:bg-primary
                      before:bg-opacity-60 before:content-['']"
                      />
                      <div className="relative z-10 flex flex-col items-center gap-y-5 py-10">
                        {_.isEmpty(itemIcon) || (
                          <div
                            className="z-10 flex h-20 w-20 items-center justify-center
                        rounded-full bg-white">
                            <Icons name={itemIcon} className="h-20 w-20" />
                          </div>
                        )}
                        <div
                          className="z-10 mx-auto flex flex-col gap-y-[10px]
                      px-4 text-center transition-all duration-200 md:gap-y-5">
                          <h3
                            className="upeprcase font-noto text-clamp14to15 font-bold uppercase
                        leading-1.625 tracking-[1.5px] text-white">
                            {itemTitle}
                          </h3>
                          <div
                            className="font-noto text-clamp14to15 font-normal leading-1.625
                            text-white">
                            {itemText}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              );
            })}
          </div>
        </motion.div>
      </BoxedContainer>
    </AnimatePresence>
  );
}

export default HeaderDesktopApplicationsMenu;
