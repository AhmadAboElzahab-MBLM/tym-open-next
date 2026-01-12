import React, { useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import _ from 'lodash';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import BodyLock from '@/components/layout/body-lock';
import BoxedContainer from '@/components/layout/boxed-container';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

function HeaderDesktopLinksMenu({ allItems, lang, selectedTitle, toggleCursor = () => null }) {
  const pathname = usePathname();
  const { translations } = useContext(GlobalContext);
  const newPathname = typeof window !== 'undefined' && new URL(window.location.href).pathname + window.location.hash;

  const handleClick = (e, href) => {
    e.preventDefault();
    window.location.href = href;
  };

  return (
    <AnimatePresence>
      <BodyLock />
      <BoxedContainer>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onMouseEnter={() => toggleCursor(false)}
          onMouseLeave={() => toggleCursor(true)}
          className="h-screen w-full bg-porcelain py-16">
          <div className="flex w-full justify-between gap-6">
            {_.map(allItems, (_val, _key) => {
              const item = _.get(_val, 'content.properties', {});
              const label = _.get(item, 'groupName', '');
              const links = _.get(item, 'links', []);

              return (
                <div key={_key} className="flex flex-col gap-8">
                  <span
                    data-selected={_.isEqual(_.toLower(label), _.toLower(selectedTitle))}
                    className="font-noto text-clamp14to15 font-bold uppercase
                    data-[selected=true]:!text-cherry">
                    {label}
                  </span>
                  <div className="flex flex-col gap-5">
                    {_.map(links, (link, __key) => {
                      resolveInternalLinks(link, lang);
                      const linkLabel = _.get(link, 'title', '');
                      const linkUrl = _.get(link, 'route.path', null) || _.get(link, 'url', '#');
                      const linkString = _.get(link, 'queryString', null);
                      const href = linkUrl + (linkString !== null ? linkString : '#');
                      const target = _.get(link, 'target', null);
                      let isActive = false;

                      if (linkLabel === getTranslationByKey('See TYM Offices',translations,lang)) {
                        isActive = newPathname.includes('/contact#offices');
                      } else if (linkLabel === getTranslationByKey('Contact TYM',translations,lang)) {
                        isActive = newPathname.endsWith('/contact');
                      } else {
                        const hrefSegments = _.split(href, '/');
                        const secondLastHrefSegment = hrefSegments[hrefSegments.length - 2];
                        const lastSegment = _.last(_.split(pathname, '/'));

                        isActive = secondLastHrefSegment === lastSegment;
                      }

                      return (
                        <div key={__key} className="relative">
                          <Link
                            href={href}
                            onClick={(e) => {
                              if (linkLabel === getTranslationByKey('See TYM Offices',translations,lang) ||
                                  linkLabel === getTranslationByKey('Contact TYM',translations,lang)) {
                                handleClick(e, href);
                              }
                            }}
                            target={target}
                            className={`font-noto text-clamp14to15 before:absolute
                            before:bottom-[-2px] before:!inline before:h-[1px] before:w-[0%]
                            before:bg-cherry before:transition-all before:duration-200 before:content-['']
                            hover:text-cherry hover:before:w-full header-menu-links
                            ${isActive ? 'text-cherry' : ''}`}
                          >
                            {linkLabel}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </BoxedContainer>
    </AnimatePresence>
  );
}

export default HeaderDesktopLinksMenu;
