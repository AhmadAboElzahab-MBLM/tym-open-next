import React, { useState } from 'react';
import BoxedContainer from '@/components/layout/boxed-container';
import TitleAndText from '@/components/layout/title-and-text';
import { includes, isEmpty, toLower, trim, filter, get } from 'lodash';
import Loading from '@/components/layout/loading';
import Search from './search';
import Table from './table';

function AvailablePartsCatalogsDownloads({ data, id, products }) {
  const properties = get(data, 'properties', []);
  const title = get(properties, 'title.markup', null);
  const text = get(properties, 'text.markup', null);
  const searchLabel = get(properties, 'searchLabel', '');
  const searchPlaceholder = get(properties, 'searchPlaceholder', '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProduct = !trim(searchQuery)
    ? products
    : filter(products, (item) => {
        const itemTitle = get(item, 'properties.title', '');
        return includes(toLower(itemTitle), toLower(searchQuery));
      });

  if (isEmpty(products)) return <Loading />;

  return (
    <section id={id} className="pt-[90px] md:pt-[120px] lg:pt-[200px] xl:pt-[260px]">
      <BoxedContainer className="flex flex-col gap-y-5 md:gap-y-7">
        <TitleAndText title={title} text={text} className="max-w-[832px]"/>
        <Search
          label={searchLabel}
          placeholder={searchPlaceholder}
          onSearchChange={setSearchQuery}
        />
        {filteredProduct.length > 0 ? (
          <Table data={filteredProduct} />
        ) : (
          <p
            className="py-5 font-noto text-clamp16to18 font-normal leading-1.75 text-primary
            lg:py-10">
            No data found.
          </p>
        )}
      </BoxedContainer>
      <div />
    </section>
  );
}

export default AvailablePartsCatalogsDownloads;
