import React from 'react';
import _ from 'lodash';
import Image from 'next/image';
import BoxedContainer from './layout/boxed-container';
import Button from './layout/button';

export default function ExploreThreed({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const link = _.get(data, 'properties.link[0]', {});
  const image = _.get(data, 'properties.image[0]', {});

  return (
    <section id={id} className="pt-8 md:pt-[80px]">
      <BoxedContainer>
        <div className="flex flex-col gap-y-[20px] lg:gap-y-[40px]">
          <div className="flex flex-col gap-y-3 lg:gap-y-[20px]">
            {_.isEmpty(title) || (
              <div
                className="text-clamp32to48 font-bold uppercase leading-1.25
          text-primary md:leading-[45px] lg:leading-[54px]"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {_.isEmpty(text) || (
              <div
                className="font-noto text-clamp14to18 font-normal leading-1.77 text-primary"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
          {_.isEmpty(link) || (
            <div className="w-fit">
              <Button
                label={link.title}
                url={link.url}
                target={link.target}
                variant="primaryMercury"
                text="explore-3d-link"
              />
            </div>
          )}
        </div>
      </BoxedContainer>
      <div className="pt-[30px] lg:pt-[86px]">
        {_.isEmpty(image) || (
          <Image src={image.url} alt={image.name} fill className="!relative h-full w-full" />
        )}
      </div>
    </section>
  );
}
