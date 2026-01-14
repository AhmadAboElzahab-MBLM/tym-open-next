import React from 'react';
import BoxedContainer from '@/components/layout/boxed-container';
import TitleAndText from '@/components/layout/title-and-text';
import Image from 'next/image';
import _ from 'lodash';

function OurCapabilities({ data, id }) {
  const title = _.get(data, 'properties.title.markup');
  const text = _.get(data, 'properties.text.markup');
  const items = _.get(data, 'properties.items.items');

  return (
    <section id={id} className="pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <TitleAndText title={title} text={text} className="max-w-[832px]" />
      </BoxedContainer>
      <BoxedContainer variant="lg">
        <div className="flex w-full flex-col gap-y-4 py-4 md:py-6 lg:gap-y-5 lg:py-5 lg:pt-9">
          {_.map(items, (item, index) => {
            const itemImages = _.get(item, 'content.properties.image', []);
            const itemSubtitle = _.get(item, 'content.properties.subtitle', '');
            const itemText = _.get(item, 'content.properties.text.markup', '');
            const itemTitle = _.get(item, 'content.properties.title', '');

            return (
              <div className="flex w-full flex-col border border-grey lg:flex-row">
                <div
                  className="grid w-full grid-cols-2 gap-px overflow-hidden
                    sm:grid-cols-4 lg:!aspect-65/72 lg:w-[40%] lg:grid-cols-2"
                  key={index}>
                  {_.map(itemImages, (image, ind) => (
                    <div key={ind}>
                      <Image
                        src={image.url}
                        alt={itemSubtitle}
                        fill
                        className="!relative !h-[140px] overflow-hidden !object-cover md:!h-full"
                      />
                    </div>
                  ))}
                </div>
                <div
                  className="flex w-full flex-col gap-y-3 px-5 py-5 md:gap-y-6 md:px-12
                    md:py-6 lg:w-[60%] lg:gap-y-8 lg:px-16 lg:py-8 xl:px-20 xl:py-10 2xl:px-24
                    2xl:py-12 3xl:px-28 3xl:py-14 4xl:px-32">
                  <span className="font-noto text-clamp12to15 font-bold uppercase tracking-[1.5px]">
                    {itemSubtitle}
                  </span>
                  <h5 className="font-sans text-clamp20to28 font-bold uppercase">{itemTitle}</h5>
                  {_.isEmpty(itemText) || (
                    <div
                      className="flex flex-col gap-y-2 font-noto text-clamp14to18 leading-1.77
                     md:gap-y-[15px] lg:gap-y-[20px]"
                      dangerouslySetInnerHTML={{ __html: itemText }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </BoxedContainer>
    </section>
  );
}

export default OurCapabilities;
