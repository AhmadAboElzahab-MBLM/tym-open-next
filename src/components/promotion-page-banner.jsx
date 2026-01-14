import _ from 'lodash';
import Image from 'next/image';
import React from 'react';

export default function PromotionPageBanner({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const firstText = _.get(data, 'properties.firstText.markup', '');
  const secondText = _.get(data, 'properties.secondText.markup', '');
  const image = _.get(data, 'properties.image', null);
  const mobileImage = _.get(data, 'properties.mobileImage', null);
  return (
    <section id={id} className="relative bg-white px-4 pt-[100px] lg:pt-[151px] 4xl:px-0">
      <div
        className="relative mx-auto flex h-[500px] max-w-[1520px] overflow-hidden
      px-4 md:h-[820px] 3xl:px-0">
        <div className="z-10 mx-auto flex h-full w-full max-w-[1054px] flex-col justify-between">
          <div
            className="mx-auto max-w-[708px] text-center font-noto-kr text-clamp32to58
            font-bold leading-[146%] text-black"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <div className="flex flex-col justify-between gap-3 md:flex-row md:gap-5">
            <div
              className="font-noto-kr text-clamp16to24 font-normal
          leading-[170%] text-black ul-child:pl-4 li-child:list-disc md:max-w-[434px]"
              dangerouslySetInnerHTML={{ __html: firstText }}
            />
            <div
              className="font-noto-kr text-clamp16to24
          font-normal leading-[170%] text-black ul-child:pl-4 li-child:list-disc
          md:max-w-[434px]"
              dangerouslySetInnerHTML={{ __html: secondText }}
            />
          </div>
        </div>
        {_.isEmpty(image) || (
          <Image
            src={image[0].url}
            alt="promotion page banner"
            fill
            className="!absolute hidden h-full w-full object-cover md:block "
          />
        )}
        {_.isEmpty(mobileImage) || (
          <Image
            src={mobileImage[0].url}
            alt="promotion page banner"
            fill
            className="!absolute block h-full w-full object-cover md:hidden"
          />
        )}
      </div>
    </section>
  );
}
