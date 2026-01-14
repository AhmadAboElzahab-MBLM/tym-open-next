import React, { useContext } from 'react';
import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import Icons from '@/components/layout/icons';
import { getTranslationByKey } from '@/utils/translation-helper';
import handleKoEnDate from '@/helpers/handle-ko-en-date';
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
  const featuredImage = _.get(item, 'properties.featuredImage[0]', {});
  const type = _.get(item, 'properties.type', '');
  const title = _.get(item, 'properties.title', '');
  const pageContent = _.get(item, 'properties.description', '');
  const date = _.get(item, 'properties.date', '');
  const path = _.get(item, 'route.path', '');

  return (
    <div
      className="flex max-h-[34.75rem] w-full max-w-[34rem]
      flex-col bg-white sm:w-[calc(50%-1rem)]">
      {_.isEmpty(featuredImage) || (
        <div className="relative w-full sm:!h-[300px]">
          <Image
            src={featuredImage.url}
            alt={featuredImage.name}
            fill
            className="!relative !aspect-video !h-full !w-full border border-grey !object-cover"
          />
          <h3
            className="absolute bottom-0 left-0 flex h-[40px] w-fit items-center justify-center
            bg-cherry px-4 kr-text  font-noto text-[12px] font-bold uppercase tracking-[1.5px]
            text-white md:text-[15px]">
            {getTranslationByKey(type, translations, lang)}
          </h3>
        </div>
      )}
      <div
        className="flex h-full w-full flex-col justify-between gap-y-3 border border-t-0
      border-grey p-5 sm:p-7 sm:pb-[44px] md:gap-y-5">
        <h3
          className="kr-text  font-noto text-clamp14to18 font-bold leading-[167%]"
          style={ellipsisTextStyle}>
          {title}
        </h3>
        {_.isEmpty(pageContent) || (
          <div
            className="kr-text  font-noto text-clamp12to15 leading-[160%]"
            style={ellipsisTextStyle}
            dangerouslySetInnerHTML={{ __html: pageContent }}
          />
        )}

        <div className="flex flex-row items-center justify-between gap-5 sm:pt-[12px]">
          {path && (
            <Link href={path || '#'} className="flex items-center gap-x-3 latest-news-card-link">
              <Icons name="ArrowRight" className="stroke-primary stroke-2" />
              <span className="kr-text  font-noto text-clamp14to15 font-bold">
                {getTranslationByKey('Read article', translations, lang)}
              </span>
            </Link>
          )}
          {_.isEmpty(date) || (
            <span className="kr-text font-noto text-clamp12to15 font-bold">
              {handleKoEnDate(date, lang, { year: 'numeric', month: 'numeric', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;