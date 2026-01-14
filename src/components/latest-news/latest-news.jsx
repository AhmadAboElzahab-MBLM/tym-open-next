'use client';

import React, { useState } from 'react';
import _, { includes, toLower, get, isEmpty, filter } from 'lodash';
import TitleAndText from '@/components/layout/title-and-text';
import BoxedContainer from '@/components/layout/boxed-container';
import Filter from '@/components/latest-news/filter';
import FeaturedBanner from '@/components/latest-news/featured-banner';
import ItemsList from '@/components/latest-news/items-list';
import Loading from '@/components/layout/loading';

export default function LatestNews({ data, id, region, locale, lang, mediaItem }) {
  const title = get(data, 'properties.title.markup', '');
  const text = get(data, 'properties.text.markup', '');

  _.forEach(mediaItem, (value) => {
    const valueType = _.get(value, 'properties.type', '');
    if (valueType === 'Event') {
      _.set(value, 'properties.type', 'Exhibition');
    }
  });

  const [selectedFilter, setSelectedFilter] = useState({
    type: '',
    searchTerm: '',
    productType: '',
  });
  const uniqueTypes = Array.from(new Set(mediaItem.map((item) => item.properties.type)));
  const uniqueProductTypes = Array.from(
    new Set(mediaItem.map((item) => item.properties.productType)),
  );
  const filterOptions = [
    { label: 'All', value: '' },
    ...uniqueTypes
      .map((type) => ({ label: type, value: type }))
      .filter((option) => option.label !== null && option.value !== null),
  ];

  const filteredMediaItem = filter(mediaItem, (item) => {
    const itemDate = new Date(item.properties.date).getTime();
    const startDate = selectedFilter.startDate ? new Date(selectedFilter.startDate).getTime() : 0;
    const endDate = selectedFilter.endDate
      ? new Date(selectedFilter.endDate).getTime()
      : Number.MAX_SAFE_INTEGER;

    return (
      itemDate >= startDate &&
      itemDate <= endDate &&
      (selectedFilter.type ? item.properties.type === selectedFilter.type : true) &&
      (selectedFilter.productType
        ? item.properties.productType === selectedFilter.productType
        : true) &&
      (selectedFilter.searchTerm
        ? includes(
            toLower(get(item, 'properties.title', '')),
            toLower(get(selectedFilter, 'searchTerm', '')),
          )
        : true)
    );
  }).sort((a, b) => {
    const aDate = new Date(get(a, 'properties.date', ''));
    const bDate = new Date(get(b, 'properties.date', ''));
    return bDate - aDate;
  });

  // console.log(_.map(mediaItem, 'properties.type'));

  if (isEmpty(mediaItem)) return <Loading />;

  return (
    <section id={id} className="pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer className="z-20">
        <TitleAndText title={title} text={text} />
        <Filter
          productTypes={uniqueProductTypes}
          filterOptions={filterOptions}
          setSelectedFilter={setSelectedFilter}
          selectedFilter={selectedFilter}
        />
      </BoxedContainer>
      <BoxedContainer variant="lg">
        <FeaturedBanner data={filteredMediaItem} />
      </BoxedContainer>
      <BoxedContainer>
        {filteredMediaItem.length > 0 ? (
          <ItemsList items={filteredMediaItem} />
        ) : (
          <p
            className="py-5 font-noto text-[15px] font-normal leading-[26px]
          text-primary lg:py-10 lg:text-[18px] lg:leading-[32px]">
            No data found.
          </p>
        )}
      </BoxedContainer>
    </section>
  );
}
