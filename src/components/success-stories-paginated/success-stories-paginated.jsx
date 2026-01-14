import React, { useCallback, useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import BoxedContainer from '@/components/layout/boxed-container';
import Filter from '@/components/success-stories-paginated/filter';
import TitleAndText from '@/components/layout/title-and-text';
import ItemsList from '@/components/success-stories-paginated/items-list';
import Loading from '@/components/layout/loading';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

function SuccessStoriesPaginated({ data, id, customerStory }) {
  const { translations, lang } = useContext(GlobalContext);
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const [filteredData, setFilteredData] = useState(customerStory);
  const [selectedFilter, setSelectedFilter] = useState({
    tractorModel: '',
    productType: 'All',
    series: '',
  });

  const productTypesFromData = _.chain(customerStory)
    .map((item) => item?.properties?.productType)
    .compact()
    .uniq()
    .sortBy()
    .value();
  const uniqueProductTypes = [
    { label: 'All', value: 'All' },
    ...productTypesFromData.map((type) => ({ label: type, value: type })),
  ];

  const uniqueTractorModel = _.chain(customerStory)
    .filter(
      (item) =>
        selectedFilter.productType === 'All' ||
        item?.properties?.productType === selectedFilter.productType,
    )
    .map((item) => item?.properties?.tractorModel)
    .compact()
    .uniq()
    .sort()
    .value();

  const uniqueSeries = _.chain(customerStory)
    .filter(
      (item) =>
        selectedFilter.productType === 'All' ||
        item?.properties?.productType === selectedFilter.productType,
    )
    .map((item) => item?.properties?.series)
    .compact()
    .uniq()
    .sort()
    .map((val) => ({ label: val, value: val }))
    .thru((array) => _.concat([{ label: 'All', value: '' }], array))
    .value();

  const handleFilter = useCallback((value) => {
    const [key, val] = Object.entries(value)[0];

    if (key === 'productType') {
      setSelectedFilter((prev) => ({
        ...prev,
        [key]: val === 'All' ? 'All' : val,
        tractorModel: '',
        series: '',
      }));
    } else if (key === 'tractorModel' && val === 'TRACTOR MODEL') {
      setSelectedFilter((prev) => ({
        ...prev,
        tractorModel: '',
      }));
    } else {
      setSelectedFilter((prev) => ({
        ...prev,
        [key]: val === 'All' ? 'All' : val,
      }));
    }
  }, []);

  function applyFilters(originalData, filters) {
    const filtered = _.filter(originalData, (item) => {
      const isTractorModelMatch =
        !filters.tractorModel || item?.properties?.tractorModel === filters.tractorModel;
      const isProductTypeMatch =
        filters.productType === 'All' || item?.properties?.productType === filters.productType;
      const isSeriesMatch = !filters.series || item?.properties?.series === filters.series;
      return isTractorModelMatch && isProductTypeMatch && isSeriesMatch;
    });

    return filtered;
  }

  useEffect(() => {
    if (_.isEmpty(customerStory)) return;

    const sortedCustomerStory = customerStory.sort((a, b) => {
      const dateA = new Date(_.get(a, 'properties.date'));
      const dateB = new Date(_.get(b, 'properties.date'));
      return dateB - dateA;
    });

    const filtered = applyFilters(sortedCustomerStory, selectedFilter);
    setFilteredData(filtered);
  }, [customerStory, selectedFilter]);

  if (_.isEmpty(customerStory)) return <Loading />;

  return (
    <section id={id} className="pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <TitleAndText title={title} text={text} className="max-w-[832px]" />
        <Filter
          tractorModel={uniqueTractorModel}
          productTypes={uniqueProductTypes}
          series={uniqueSeries}
          handleFilter={handleFilter}
          selectedFilter={selectedFilter}
        />
        {_.isEmpty(filteredData) ? (
          <div
            className="flex py-5 font-noto text-clamp16to18 font-normal leading-1.625
            text-primary lg:py-10">
            <span>{`${getTranslationByKey('No data found', translations, lang)}.`}</span>
          </div>
        ) : (
          <ItemsList items={filteredData} />
        )}
        <div className="h-[1px] w-full bg-cherry" />
      </BoxedContainer>
    </section>
  );
}

export default SuccessStoriesPaginated;
