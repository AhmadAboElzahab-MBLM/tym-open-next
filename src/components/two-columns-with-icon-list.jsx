import React from 'react';
import BoxedContainer from '@/components/layout/boxed-container';
import _ from 'lodash';
// import Link from 'next/link';
import Image from 'next/image';
import Button from './layout/button';

function TwoColumnsWithIconList({ data, id }) {
  const subtitle = _.get(data, 'properties.subtitle', false);
  const title = _.get(data, 'properties.title', '');
  const text = _.get(data, 'properties.text.markup', '');
  const cta = _.get(data, 'properties.cta', false);
  const image = _.get(data, 'properties.image', false);
  const items = _.get(data, 'properties.items.items', []);

  const handleSmoothScrollBtn = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id={id} className="pt-8 md:pt-10 lg:pt-20">
      <BoxedContainer className="bg-[#f2f2f2] bg-opacity-60 xl:!max-w-[1280px] xl:!px-20">
        <div className="grid grid-cols-12 justify-between py-10 md:py-12 lg:py-16 xl:py-20">
          <div className="col-span-12 flex flex-col justify-between md:col-span-5">
            <div className="flex flex-col gap-y-3 pb-8 md:gap-y-6 md:pb-12 lg:pb-16 xl:pb-20 xl:pe-14">
              {_.isEmpty(subtitle) || (
                <h4 className="font-noto text-clamp12to15 font-bold uppercase tracking-[1px] md:tracking-[1.5px]">
                  {subtitle}
                </h4>
              )}
              {_.isEmpty(title) || (
                <div className="text-clamp20to28 font-bold uppercase leading-1.42">{title}</div>
              )}
              {_.isEmpty(text) || (
                <div
                  className="max-w-[928px] font-noto text-clamp12to15 leading-1.77"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              )}

              {_.isEmpty(cta) || (
                <Button
                  clickHandler={(e) => handleSmoothScrollBtn(e, cta[0]?.url)}
                  label={cta[0].title}
                  url={`${cta[0].url}`}
                  target={cta[0].target}
                  variant="primaryCherry"
                  text="max-w-[302px] mt-3"
                />
              )}
            </div>

            {_.isEmpty(image) || (
              <Image
                src={image[0].url}
                alt={title}
                width={448}
                height={530}
                className="w-full object-contain"
              />
            )}
          </div>
          <div className="col-span-1 h-10 md:h-0" />
          <div className="col-span-12 space-y-8 md:col-span-6 md:space-y-10 lg:space-y-12">
            {items.map((item, index) => {
              const content = _.get(item, 'content', {});
              const iconImage = _.get(content, 'properties.iconImage', false);
              const itemTitle = _.get(content, 'properties.title', '');
              const itemText = _.get(content, 'properties.text', '');

              return (
                <div key={index} className="flex gap-3 md:gap-4 lg:gap-5">
                  <div className="relative min-w-[60px] text-center md:min-w-[80px] lg:min-w-[95px] xl:min-w-[110px]">
                    {iconImage && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}${iconImage[0].url}`}
                        alt={itemTitle}
                        width={110}
                        height={90}
                        className="mx-auto h-[50px] w-auto object-contain md:h-[65px] lg:h-[80px] xl:h-[90px]"
                      />
                    )}
                  </div>
                  <div className="space-y-4 font-noto leading-[1.6]">
                    <h3 className="text-clamp14to16 font-bold">{itemTitle}</h3>
                    <div className="text-clamp12to15">{itemText}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BoxedContainer>
    </section>
  );
}

export default TwoColumnsWithIconList;
