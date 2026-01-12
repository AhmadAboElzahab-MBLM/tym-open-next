import React, { useContext } from 'react';
import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslationByKey } from '@/utils/translation-helper';
import Icons from '@/components/layout/icons';
import GlobalContext from '@/context/global-context';
import resolveInternalLinks from '@/helpers/resolve-url-locale';

function Card({ item }) {
  const ellipsisTextStyle = {
    maxWidth: '100%',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  const { translations, lang } = useContext(GlobalContext);
  resolveInternalLinks(item, lang);

  const featuredImage = _.get(item, 'properties.featuredImage[0].url', '');
  const type = _.get(item, 'properties.type', '');
  const tractorModel = _.get(item, 'properties.tractorModel', '');
  const series = _.get(item, 'properties.series', '');
  const title = _.get(item, 'properties.title', '');
  const description = _.get(item, 'properties.description', '');
  const route = _.get(item, 'route.path', '');

  return (
    <div
      className="flex max-h-[34.75rem] w-full max-w-[34rem] flex-col border
      border-grey bg-white sm:w-[calc(50%-1rem)]">
      {_.isEmpty(featuredImage) || (
        <div className="relative w-full sm:!h-[300px]">
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="!relative !aspect-video !h-full !w-full !object-cover"
          />
          <div className="absolute bottom-0 left-0 flex flex-row gap-x-[8px]">
            {_.isEmpty(type) || (
              <h3
                className="flex h-[40px] min-w-[104px] items-center justify-center bg-cherry
                px-2 font-noto text-[13px] font-bold uppercase tracking-[1.5px] text-white
                md:px-4 md:text-[15px]">
                {getTranslationByKey(type, translations, lang)}
              </h3>
            )}
            {_.isEmpty(tractorModel) || (
              <h3
                className="flex h-[40px] min-w-[104px] items-center justify-center bg-cherry
                px-2 font-noto text-[13px] font-bold uppercase tracking-[1.5px] text-white
                md:px-4 md:text-[15px]">
                {getTranslationByKey(tractorModel, translations, lang)}
              </h3>
            )}
            {_.isEmpty(series) || (
              <h3
                className="flex h-[40px] min-w-[104px] items-center justify-center bg-cherry
                px-2 font-noto text-[13px] font-bold uppercase
              tracking-[1.5px] text-white md:px-4 md:text-[15px]">
                {getTranslationByKey(series, translations, lang)}
              </h3>
            )}
          </div>
        </div>
      )}
      <div
        className="flex h-full w-full flex-col justify-between gap-y-5 p-5
        sm:p-7 sm:pb-[44px]">
        <h3
          className="font-noto text-clamp16to18 font-bold leading-1.5 text-primary"
          style={ellipsisTextStyle}>
          {title}
        </h3>
        {_.isEmpty(description) || (
          <div
            className="line-clamp-2 font-noto text-clamp14to15 leading-1.25 text-primary"
            style={ellipsisTextStyle}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        {_.isEmpty(route) || (
          <Link href={route || '#'} className="flex items-center gap-x-3 sm:pt-[12px] how-to-checklist-card-link">
            <Icons name="ArrowRight" className="stroke-primary stroke-2" />
            <span className="font-noto text-clamp14to15 font-bold">
              {getTranslationByKey('Read article', translations, lang)}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Card;
