import React from 'react';
import _ from 'lodash';

export default function TitleSection({ data, className = '' }) {
  return (
    _.isEmpty(data) || (
      <div
        className={`text-clamp20to28 font-bold uppercase leading-[1.25] ${className}`}
        dangerouslySetInnerHTML={{ __html: data }}
      />
    )
  );
}
