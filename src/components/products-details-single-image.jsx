import React from 'react';
import _ from 'lodash';
import Image from 'next/image';
import BoxedContainer from './layout/boxed-container';

export default function ProductsDetailsSingleImage({ data }) {
  const image = _.get(data, 'properties.threeSixtyImages', []);
  return (
    <section className="py-10">
      <BoxedContainer>
        {_.isEmpty(image) || (
          <Image
            src={image[0].url}
            alt="Details Single Image"
            fill
            className="!relative h-full w-full"
          />
        )}
      </BoxedContainer>
    </section>
  );
}
