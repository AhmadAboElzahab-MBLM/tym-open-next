'use client';

import React from 'react';
import _, { get, isEmpty } from 'lodash';
import BoxedContainer from './layout/boxed-container';

export default function ProductDetailsVideo({ data, id }) {
  const videoMedia = get(data, 'properties.videoMedia[0]', {});
  if (_.isEmpty(videoMedia)) return null;
  return (
    <section id={id} className="pt-6 md:pt-10">
      <BoxedContainer>
        {isEmpty(videoMedia) || (
          <div>
            <video
              className="!relative !h-full !w-full rounded-md
              object-cover !pt-0"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              >
              <source src={videoMedia.url} type="video/mp4" />
            </video>
          </div>
        )}
      </BoxedContainer>
    </section>
  );
}
