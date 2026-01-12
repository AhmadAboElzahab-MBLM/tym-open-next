import _ from 'lodash';
import React from 'react';
import Image from 'next/image';
import BoxedContainer from './layout/boxed-container';

export default function TextWithTwoImages({ data }) {
  const items = _.get(data, 'properties.textWithTwoImagesItems', null);
  if (_.isEmpty(items)) return null;
  return (
    <section className="pt-[60px] lg:pt-[160px]">
      <BoxedContainer>
        {_.isEmpty(items) ||
          _.map(items.items, (item, index) => (
            <div
              key={index}
              className="flex flex-col gap-y-4 border-t border-t-cherry lg:gap-y-8
              lg:pb-20">
              <div
                className="mx-auto flex max-w-[800px] flex-col items-center gap-y-4 pt-6
              md:pt-10 lg:gap-y-8 lg:pt-20">
                <h3
                  className="text-clamp20to28 font-bold uppercase
                  leading-1.42">
                  {item.content.properties.title}
                </h3>
                {_.isEmpty(item.content.properties.text) || (
                  <div
                    className="text-center font-noto text-clamp16to18 leading-1.625 text-primary"
                    dangerouslySetInnerHTML={{ __html: item.content.properties.text?.markup }}
                  />
                )}
              </div>
              {_.isEmpty(item.content.properties.image) || (
                <Image
                  src={_.get(item, 'content.properties.image[0].url', '')}
                  alt={item.content.properties.title}
                  fill
                  className="!relative"
                />
              )}
            </div>
          ))}
      </BoxedContainer>
    </section>
  );
}
