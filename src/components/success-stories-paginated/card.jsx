import React, { useContext } from 'react';
import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import Icons from '@/components/layout/icons';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';
import resolveInternalLinks from '@/helpers/resolve-url-locale';

function Card({ item }) {
  const { translations, lang } = useContext(GlobalContext);
  resolveInternalLinks(item, lang);
  const featuredImage = _.get(item, 'properties.featuredImage[0]', {});
  const tractorModel = _.get(item, 'properties.tractorModel', '');
  const series = _.get(item, 'properties.series', '');
  const productType = _.get(item, 'properties.productType', '');
  const title = _.get(item, 'properties.title', '');
  const subtitle = _.get(item, 'properties.subtitle', '');
  const description = String(subtitle).replace(/["“”]/g, '');
  const route = _.get(item, 'route.path', '');

  return (
    <div
      className="relative flex w-full flex-col-reverse border border-grey bg-white sm:aspect-8/5
      sm:flex-col md:aspect-video lg:aspect-28/13">
      {_.isEmpty(featuredImage) || (
        <Image
          src={featuredImage.url}
          alt={featuredImage.name}
          fill
          className="!relative !object-cover sm:!absolute"
        />
      )}
      <div
        className="relative z-10 flex h-full max-w-128.5 flex-col gap-y-3 
        bg-white bg-opacity-40 p-4 !pt-0
        pb-0 transition-all sm:bg-[transparent] sm:bg-auto sm:pb-7 
        md:gap-y-7 md:p-7">
        <div className="flex flex-wrap gap-2.5">
          {_.isEmpty(productType) || (
            <span
              className="bg-cherry px-4 py-2.5 font-noto text-clamp12to15 font-bold uppercase
              tracking-[1.5px] text-white">
              {getTranslationByKey(productType, translations, lang)}
            </span>
          )}
          {_.isEmpty(series) || (
            <span
              className="bg-cherry px-4 py-2.5 font-noto text-clamp12to15 font-bold uppercase
              tracking-[1.5px] text-white">
              {getTranslationByKey(series, translations, lang)}
            </span>
          )}
          {_.isEmpty(tractorModel) || (
            <span
              className="bg-cherry px-4 py-2.5 font-noto text-clamp12to15 font-bold uppercase
            tracking-[1.5px] text-white">
              {getTranslationByKey(tractorModel, translations, lang)}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-y-5">
          <div
            className="korean-font font-noto text-clamp16to18 font-bold leading-1.5
          text-primary transition-all">
            {title}
          </div>
          <div
            className="korean-font line-clamp-2 font-noto text-clamp12to15
          leading-1.25 text-primary transition-all lg:leading-[24px]">
            {description}
          </div>
        </div>
        {_.isEmpty(route) || (
          <Link
            href={route || '#'}
            className="flex items-center gap-x-3 transition-all 
            svg-child-path:!stroke-primary">
            <Icons name="ArrowRight" className="stroke-2" />
            <span className="font-noto text-clamp14to15 font-bold text-primary">
              {getTranslationByKey('Read story', translations, lang)}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Card;
