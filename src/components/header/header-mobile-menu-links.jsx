import React, { useContext } from 'react';
import _ from 'lodash';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import GlobalContext from '@/context/global-context';
import Link from 'next/link';

function HeaderMobileMenuLinks({ data, handleViewChange }) {
  const { lang } = useContext(GlobalContext);
  const groupName = _.get(data, 'groupName', '');
  const links = _.get(data, 'links', []);
  const firstLink = _.get(links, '[0]', {});
  const firstLinkUrl = _.get(firstLink, 'url', null) || _.get(firstLink, 'route.path', '#');
  resolveInternalLinks(firstLink, lang);
  resolveInternalLinks(firstLinkUrl, lang);
  const handleMenuClick = () => {
    handleViewChange('menu');
  };

  return (
    <div className="flex h-full w-full flex-col items-start">
      <button
        onClick={handleMenuClick}
        type="button"
        className="h-fit px-7 py-5 font-noto text-[15px] font-bold uppercase
        tracking-widest text-cherry">
        menu
      </button>
      <div className="custom-shadow-top-only flex h-full w-full flex-col items-start gap-10 px-7 py-5">
        {_.isEmpty(firstLink) || (
          <Link
            href={firstLinkUrl || '#'}
            className="h-fit font-noto text-[15px] font-bold uppercase tracking-widest text-cherry">
            {groupName}
          </Link>
        )}

        <div className="flex h-full w-full flex-col items-start gap-7">
          {_.map(links, (item, key) => {
            resolveInternalLinks(item, lang);
            const itemUrl = _.get(item, 'url', null) || _.get(item, 'route.path', '#');
            const itemTitle = _.get(item, 'title', '');
            return (
              <Link
                key={key}
                href={itemUrl || '#'}
                className="h-fit font-noto text-[15px] font-normal text-primary header-mobile-menu-link">
                {itemTitle}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HeaderMobileMenuLinks;
