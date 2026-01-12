import React, { useContext } from 'react';
import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslationByKey } from '@/utils/translation-helper';
import Icons from '@/components/layout/icons';
import GlobalContext from '@/context/global-context';
import resolveInternalLinks from '@/helpers/resolve-url-locale';

function FeaturedBanner({ data = [] }) {
  const elipsisTextStyle = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  const { translations, lang } = useContext(GlobalContext);

  return _.map(data, (item, index) => {
    const itemFeatured = _.get(item, 'properties.featured', null);
    const itemTitle = _.get(item, 'properties.title', '');
    const itemFeaturedImage = _.get(item, 'properties.featuredImage[0]', {});
    const itemPageContent = _.get(item, 'properties.description', '');
    const itemType = _.get(item, 'properties.type', '');
    resolveInternalLinks(item, lang);

    return (
      itemFeatured && (
        <div key={index} className="relative my-4 flex w-full flex-col gap-y-5">
          {_.isEmpty(itemFeaturedImage) || (
            <Image
              alt={itemFeaturedImage.title}
              src={itemFeaturedImage.url}
              className="!relative !z-0 max-h-[820px] max-w-full object-cover"
              fill
              loading="lazy"
            />
          )}
          <div className="absolute left-0 top-0 z-[5] w-full bg-gradient-radial from-primary-0 to-primary-25 md:h-full" />
          <div
            className="z-10 flex flex-col justify-end gap-y-3 md:absolute md:inset-0
            md:bottom-4 md:gap-y-5 md:px-[4%] md:pb-[5%]">
            <button
              type="button"
              className="self-start bg-cherry px-5 py-2.5 font-noto text-clamp12to15 font-bold
              uppercase tracking-widest text-white transition-all hover:bg-paprika md:px-7">
              {getTranslationByKey(itemType, translations, lang)}
            </button>
            <div
              className="max-w-[448px] font-noto text-clamp16to18 font-bold md:text-white md:pt-3
              leading-[167%]"
              style={elipsisTextStyle}>
              {itemTitle}
            </div>
            {_.isEmpty(itemPageContent) || (
              <div
                className="max-w-[448px] font-noto text-clamp12to15 md:text-white leading-[160%]"
                style={elipsisTextStyle}
                dangerouslySetInnerHTML={{ __html: itemPageContent }}
              />
            )}

            {item.route && (
              <Link
                href={item.route.path || '#'}
                className="flex items-center gap-x-3 md:svg-child-path:stroke-white md:pt-3">
                <Icons name="ArrowRight" className="stroke-primary  stroke-2" />
                <span className="font-noto text-clamp14to15 font-bold md:text-white">
                  {getTranslationByKey('Read Article', translations, lang)}
                </span>
              </Link>
            )}
          </div>
        </div>
      )
    );
  });
}

export default FeaturedBanner;
