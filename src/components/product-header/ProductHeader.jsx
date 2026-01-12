import React from 'react';
import BoxedContainer from '../layout/boxed-container';
import { get, isEmpty } from 'lodash';

export default function ProductHeader({ data }) {
  const title = get(data, 'properties.title', '');
  const certified = get(data, 'properties.certified', false);
  const caption = get(data, 'properties.caption', '');

  return (
    <section
      id={data?.contentType}
      className="bg-white pt-[100px] text-primary md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-x-4 lg:gap-x-6">
            {!isEmpty(title) && <p className="promo-font text-clamp42to64 font-medium">{title}</p>}
            {certified && (
              <span className="text-clamp12to16lg:px-4 bg-[#63A33C] px-3 py-2 font-bold text-white lg:py-3">
                인증 중고
              </span>
            )}
          </div>
          {!isEmpty(caption) && (
            <p className="-mt-3 font-noto-kr text-clamp16to18 font-medium">{caption}</p>
          )}
        </div>
      </BoxedContainer>
    </section>
  );
}
