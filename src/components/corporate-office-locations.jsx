import React from 'react';
import _ from 'lodash';
import Link from 'next/link';
import BoxedContainer from './layout/boxed-container';
import Icons from './layout/icons';

export default function CorporateOfficeLocations({ id, data }) {
  const title = _.get(data, 'properties.title', '');
  const text = _.get(data, 'properties.text.markup', '');
  const items = _.get(data, 'properties.items', null);
  const sectionId = _.get(data, 'properties.sectionId', '') || id;

  return (
    <section id={sectionId} className="pt-10 md:pt-20">
      <BoxedContainer>
        <div className="h-[1px] w-full bg-cherry" />
        <div className="flex flex-col gap-y-6 pt-8 md:gap-y-[60px] md:pt-[60px]">
          <div className="flex max-w-[928px] flex-col gap-y-4 md:gap-y-8">
            <h2
              className="font-sans text-clamp20to28 font-bold
                  uppercase text-black">
              {title}
            </h2>
            {_.isEmpty(text) || (
              <div
                dangerouslySetInnerHTML={{ __html: text }}
                className="max-w-[928px] font-noto text-clamp14to18 font-normal leading-1.77
              text-black lg:leading-[32px] "
              />
            )}
          </div>
          {_.isEmpty(items) || (
            <div
              className="flex flex-row flex-wrap gap-x-10  gap-y-4 md:gap-y-[42px]
            lg:gap-x-[72px]">
              {_.map(items.items, (item, index) => (
                <div
                  key={index}
                  className="flex w-[85%] flex-col justify-between gap-y-5
                  md:w-[calc(33.3333%-27px)] lg:w-[calc(25%-54px)]">
                  <div className="flex flex-col gap-y-3">
                    <h4 className="font-noto text-clamp16to18 font-bold leading-1.625 text-primary">
                      {item?.content?.properties?.title}
                    </h4>
                    {_.isEmpty(item?.content?.properties?.address) || (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item?.content?.properties?.address.markup,
                        }}
                        className="flex flex-col gap-y-1.5 font-noto text-clamp12to15
                    font-normal leading-1.625 text-primary md:gap-y-3 lg:leading-[24px]"
                      />
                    )}
                  </div>

                  {_.isEmpty(item.content.properties.location) || (
                    <Link
                      href={item.content.properties.location || '#'}
                      target="_blank"
                      className="flex flex-row items-center gap-x-3.5 font-noto
                      text-clamp12to15 font-bold leading-1.625 text-black corporate-office-locations-button">
                      <Icons name="ArrowRight" /> {item.content.properties.locationLabel}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </BoxedContainer>
    </section>
  );
}
