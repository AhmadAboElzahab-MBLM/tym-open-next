import Link from 'next/link';
import React from 'react';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import _ from 'lodash';

export default function FooterItemsDesktop({ data, lang }) {
  const chunkedData = _.chunk(data, 2);

  function constructUrl(val) {
    const url = _.defaultTo(_.get(val, 'url'), '');
    const queryString = _.defaultTo(_.get(val, 'queryString'), '');

    return _.defaultTo(`${url}${queryString}`, '#');
  }

  return (
    <div className="hidden w-full grid-cols-3 gap-x-[85px] md:grid">
      {_.map(chunkedData, (chunk, chunkIndex) => (
        <div key={chunkIndex} className="flex flex-col gap-y-10">
          {_.map(chunk, (item, index) => {
            const groupName = _.get(item, 'properties.groupName', '');
            const links = _.get(item, 'properties.links', []);

            return (
              <div key={index} className="flex flex-col gap-y-3">
                <h5
                  className="relative w-fit pb-1.5 font-noto text-clamp14to15
                  font-bold uppercase leading-1 tracking-widest text-white">
                  {groupName}
                </h5>
                <div className="flex flex-col gap-y-2">
                  {_.map(links, (val, ind) => {
                    resolveInternalLinks(val, lang);
                    return (
                      <Link
                        key={ind}
                        href={constructUrl(val)}
                        target={val.target}
                        className="relative w-fit font-noto text-clamp14to15 font-normal
                        leading-1.5 text-white hover:text-tymRed">
                        {val.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
