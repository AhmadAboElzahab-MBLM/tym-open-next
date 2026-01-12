import React, { useContext } from 'react';
import _ from 'lodash';
import Link from 'next/link';
import Image from 'next/image';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import Icons from '@/components/layout/icons';
import GlobalContext from '@/context/global-context';

function HeaderMobileMenuApplications({ data, handleViewChange }) {
  const { lang } = useContext(GlobalContext);
  const groupName = _.get(data, 'groupName', '');
  const items = _.get(data, 'items.items', []);

  const handleMenuClick = () => {
    handleViewChange('menu');
  };

  return (
    <div className="flex h-full w-full flex-col items-start overflow-y-auto">
      <button
        onClick={handleMenuClick}
        type="button"
        className="h-fit w-full px-7 py-5 text-left font-noto text-[15px]
        font-bold uppercase tracking-widest text-cherry">
        menu
      </button>
      <div className="custom-shadow-top-only flex h-full w-full flex-col items-start gap-10 px-7 py-5">
        <button
          type="button"
          className="h-fit font-noto text-[15px] font-bold uppercase tracking-widest text-cherry">
          {groupName}
        </button>
        <div className="grid w-full grid-cols-2 content-center items-center gap-4">
          {_.map(items, (item, index) => {
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
                  className="group relative h-24 overflow-hidden header-applicaton-menu-link">
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
                    className="relative flex h-full w-full flex-col items-center justify-center
                    gap-2 transition-all duration-200">
                    <div
                      className="absolute h-full w-full transition-all duration-200
                      before:absolute before:top-0 before:z-[5] before:!inline
                      before:h-full before:w-full before:bg-primary
                      before:bg-opacity-60 before:content-['']"
                    />
                    {_.isEmpty(itemIcon) || (
                      <div
                        className="z-10 flex h-10 w-10 items-center justify-center
                        rounded-full bg-white">
                        <Icons name={itemIcon} className="h-20 w-20" />
                      </div>
                    )}
                    <div
                      className="z-10 mx-auto flex flex-col gap-y-[10px]
                      px-4 text-center transition-all duration-200 md:gap-y-5">
                      <h3
                        className="upeprcase font-noto text-[10px] font-bold uppercase
                        leading-1.625 tracking-[1.5px] text-white">
                        {itemTitle}
                      </h3>
                    </div>
                  </div>
                </Link>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HeaderMobileMenuApplications;
