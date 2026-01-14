import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { map, get, startCase, isEmpty } from 'lodash';
import Loading from '@/components/layout/loading';
import BoxedContainer from '../layout/boxed-container';
import ItemsList from './items-list';
import Filter from './filter';

export default function HowTosChecklist({ data, id, region, locale, lang, howTo }) {
  const title = get(data, 'properties.title.markup', '');
  const text = get(data, 'properties.text.markup', '');
  const [selectedFilter, setSelectedFilter] = useState({
    tractorModel: '',
    type: '',
    series: '',
  });

  const uniqueTypes = Array.from(new Set(howTo.map((item) => item.properties.type)));
  const uniqueTractorModel = Array.from(new Set(howTo.map((item) => item.properties.tractorModel)));
  const uniqueSeries = Array.from(new Set(howTo.map((item) => item.properties.series)));
  const filterOptions = [
    { label: 'All', value: '' },
    ...map(uniqueTypes, (productType) => ({
      label: startCase(productType),
      value: productType,
    })),
  ];

  const filterSeriesOptions = [
    { label: 'All', value: '' },
    ...map(uniqueSeries, (productType) => ({
      label: startCase(productType),
      value: productType,
    })),
  ];

  // console.log(howTo);

  const filteredHowTo = howTo
    .filter((item) => {
      // Extract item properties
      const itemType = get(item, 'properties.type');
      const itemTractorModel = get(item, 'properties.tractorModel');
      const itemSeries = get(item, 'properties.series');

      // Extract selected filter values
      const selectedType = get(selectedFilter, 'type');
      const selectedTractorModel = get(selectedFilter, 'tractorModel');
      const selectedSeries = get(selectedFilter, 'series');

      // Filter condition
      const typeMatch = !selectedType || itemType === selectedType;
      const tractorModelMatch = !selectedTractorModel || itemTractorModel === selectedTractorModel;
      const seriesMatch = !selectedSeries || itemSeries === selectedSeries;

      return typeMatch && tractorModelMatch && seriesMatch;
    })
    .sort((a, b) => {
      const aDate = new Date(get(a, 'properties.date'));
      const bDate = new Date(get(b, 'properties.date'));
      return bDate - aDate;
    });

  if (isEmpty(howTo)) return <Loading />;

  return (
    <section
      id={id}
      className="pb-5 pt-[90px] md:pt-[120px] lg:pb-[100px]
    lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <div
          className="flex max-w-[832px] flex-col gap-y-[15px] md:gap-y-[20px] lg:gap-y-[32px]
          lg:pb-6">
          {isEmpty(title) || (
            <div
              className="max-w-[780px] text-[26px] font-bold uppercase leading-[34px]
              text-[#000] md:text-[36px] md:leading-[45px] lg:text-[48px] lg:leading-[54px]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {isEmpty(text) || (
            <div
              className="flex flex-col gap-y-[15px] font-noto text-[15px]
              font-normal leading-[26px] text-[#000] md:gap-y-[32px] lg:text-[18px] lg:leading-[32px]"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </div>
        {isEmpty(howTo) || (
          <Filter
            tractorModel={uniqueTractorModel}
            filterOptions={filterOptions}
            filterSeriesOptions={filterSeriesOptions}
            setSelectedFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
          />
        )}

        {!isEmpty(filteredHowTo) ? (
          <ItemsList items={filteredHowTo} />
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
