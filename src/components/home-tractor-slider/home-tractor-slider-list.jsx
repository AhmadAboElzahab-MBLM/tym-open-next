'use client';

import _ from 'lodash';
import Image from 'next/image';
import React, { useContext } from 'react';
import Link from 'next/link';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';
import { getProductPower } from '@/helpers/product-handlers';
import { usePathname } from 'next/navigation';

export default function HomeTractorSliderList({ data, text }) {
  const { translations, lang } = useContext(GlobalContext);

  const path = _.get(data, 'route.path', '');
  const image = _.get(data, 'properties.featuresImage[0]', '');
  const title = _.get(data, 'properties.title', '');
  const category = _.get(data, 'properties.category', '');
  const pathUrl = usePathname();
  const koPaths = ['/ko', '/en-ko'];
  const isKO = _.some(koPaths, (koPath) => _.includes(pathUrl, koPath));

  return (
    <Link
      href={path || '#'}
      className="flex w-full flex-col sm:w-[calc(50%-8px)] md:w-[calc(25%-24px)] md:gap-y-5">
      <div className="lg:min-h-[256px]">
        {_.isEmpty(image) || (
          <Image
            src={image.url}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="!relative !h-full !w-full object-contain"
          />
        )}
      </div>
      <div className="flex flex-col gap-y-[10px]">
        <h3 className="font-noto text-[21px] font-bold leading-[24px] text-primary">
          {title} {getProductPower(data, lang, category, isKO)}
        </h3>
        <p className="font-noto text-[15px] font-normal leading-1 text-primary">
          {getTranslationByKey(text, translations, lang)}
        </p>
      </div>
    </Link>
  );
}
