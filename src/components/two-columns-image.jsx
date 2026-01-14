import _ from 'lodash';
import Image from 'next/image';
import React from 'react';
import BoxedContainer from './layout/boxed-container';

export default function TwoColumnsImage({ data = null }) {
  const { firstImage, secondImage } = data.properties;
  return (
    <div className="pt-6">
      <BoxedContainer className="default flex flex-col gap-4 md:flex-row md:gap-6">
        {_.isEmpty(firstImage) || (
          <div className="md:w-[calc(50%-12px)]">
            <Image
              src={firstImage[0].url}
              alt="first image"
              fill
              className="!relative h-full w-full"
            />
          </div>
        )}
        {_.isEmpty(secondImage) || (
          <div className="md:w-[calc(50%-12px)]">
            <Image
              src={secondImage[0].url}
              alt="second image"
              fill
              className="!relative h-full w-full"
            />
          </div>
        )}
      </BoxedContainer>
    </div>
  );
}
