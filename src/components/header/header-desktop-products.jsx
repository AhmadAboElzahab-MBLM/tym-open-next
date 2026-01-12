import React from 'react';
import _ from 'lodash';
import Image from 'next/image';

function HeaderDesktopProducts({ data }) {
  const image = _.get(data, 'image', null);
  const range = _.get(data, 'range', null);

  return (
    <div className="flex flex-col items-center">
      <Image src={image?.url} alt={image?.name} width={280} height={332} />
      <span>{range}</span>
    </div>
  );
}

export default HeaderDesktopProducts;
