import React from 'react';
import Link from 'next/link';
import _ from 'lodash';
import Icons from '@/components/layout/icons';

export default function Card({ item }) {
  if (_.isEmpty(item)) return null;
  return _.map(item.properties.partsCatalog, (catalog, index) => (
    <div key={index} className="w-full px-2">
      <div
        className="block bg-porcelain px-[10px] pb-[5px] pt-[5px]
    font-noto text-clamp12to15 font-normal leading-1.625 text-primary
    md:table-cell md:w-[18%] md:pb-[12px] md:pt-[10px]">
        {item.properties.title}
      </div>
      <div
        className="block bg-porcelain px-[10px] pb-[5px] pt-[5px]
    font-noto text-clamp12to15 font-normal leading-1.625 text-primary
    md:table-cell md:w-[60%] md:pb-[12px] md:pt-[10px]">
        {catalog.name}
      </div>
      <div
        className="block bg-porcelain px-[10px] pb-[5px] pt-[5px]
    font-noto text-clamp12to15 font-normal capitalize leading-1.625
    text-primary md:table-cell md:w-[25%] md:pb-[12px] md:pt-[10px]">
        Uploaded: {catalog.properties.version}
      </div>
      <div
        className="block bg-porcelain px-[10px] pb-[5px] pt-[5px]
    font-noto text-clamp12to15 font-normal leading-1.625 text-primary
    md:table-cell md:w-[10%] md:pb-[12px] md:pt-[10px]">
        {catalog?.url && (
          <Link
            href={catalog?.url || '#'}
            target="_blank"
            className="flex flex-row items-center gap-x-[10px] download-button">
            Download <Icons name="Download" />
          </Link>
        )}
      </div>
    </div>
  ));
}
