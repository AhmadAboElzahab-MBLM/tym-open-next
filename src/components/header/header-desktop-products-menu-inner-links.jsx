import React, { useContext } from 'react';
import { get, isEmpty, map } from 'lodash';
import Link from 'next/link';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import GlobalContext from '@/context/global-context';

export default function HeaderDesktopProductsMenuInnerLinks({ data }) {
  const { lang } = useContext(GlobalContext);
  const title = get(data, 'title', '');
  const category = get(data, 'category', '');
  const isTractor = category === 'Tractors';
  const links = get(data, 'links', []);
  const secondaryLinks = get(data, 'secondaryLinks', []);
  const bottomLinks = get(data, 'bottomLinks', []);

  return (
    <div className="w-[15.42%] border-r border-cherry pr-4 pt-4 xl:pr-8 2xl:pr-10">
      <div className="flex h-full w-full flex-col gap-6 4xl:gap-8">
        <div
          className="font-noto text-clamp12to15 font-bold uppercase tracking-[1.5px]
        text-cherry">
          {title}
        </div>
        <div className="flex h-full w-full flex-col gap-4 4xl:gap-8">
          {isEmpty(links) || (
            <div
              data-isTractor={isTractor}
              className="flex flex-col gap-2 data-[isTractor=false]:gap-8 4xl:gap-4">
              {map(links, (val) => {
                resolveInternalLinks(val, lang);
                const linkUrl = get(val, 'url', '#');
                const linkTitle = get(val, 'title', '');
                return (
                  <Link
                    href={linkUrl}
                    className="header-products-links font-noto text-clamp12to15
                  hover:text-cherry">
                    {linkTitle}
                  </Link>
                );
              })}
            </div>
          )}
          {isEmpty(secondaryLinks) || (
            <div className="flex flex-col gap-2 4xl:gap-4">
              {map(secondaryLinks, (val) => {
                resolveInternalLinks(val, lang);
                const linkUrl = get(val, 'url', '#');
                const linkTitle = get(val, 'title', '');
                return (
                  <Link
                    className="header-secondary-bottom-links font-noto text-clamp12to15 hover:text-cherry"
                    href={linkUrl}>
                    {linkTitle}
                  </Link>
                );
              })}
            </div>
          )}
          {isEmpty(bottomLinks) || (
            <div className="flex flex-col gap-4">
              {map(bottomLinks, (val) => {
                resolveInternalLinks(val, lang);
                const linkUrl = get(val, 'url', '#');
                const linkTitle = get(val, 'title', '');
                return (
                  <Link
                    className="header-products-bottom-links bg-cherry py-3 text-center font-sans text-[12px]
                    font-bold uppercase text-white transition-all duration-300 ease-in-out
                    hover:bg-paprika"
                    href={linkUrl}>
                    {linkTitle}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
