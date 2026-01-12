import React, { useState } from 'react';
import BoxedContainer from '@/components/layout/boxed-container';
import TitleAndText from '@/components/layout/title-and-text';
import { filter, get, isEmpty, toLower, trim, includes } from 'lodash';
import Loading from '@/components/layout/loading';
import ItemsPaginated from '@/components/available-downloads/items-paginated';
import Search from './search';

function AvailableDownloads({ data, id, products }) {
  const properties = get(data, 'properties', []);
  const title = get(properties, 'title.markup', null);
  const text = get(properties, 'text.markup', null);
  const searchLabel = get(properties, 'searchLabel', '');
  const searchPlaceholder = get(properties, 'searchPlaceholder', '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProduct = !trim(searchQuery)
  ? products
  : filter(products, (item) => {
      const title = toLower(get(item, 'properties.title', ''));
      const category = toLower(get(item, 'properties.category', ''));
      const query = toLower(searchQuery);
      return includes(title, query) || includes(category, query);
    });

  const filteredItems = filter(filteredProduct, (item) => {
    const downloadables = get(item, 'properties.downloadables', []);
    return !isEmpty(downloadables);
  });

  if (isEmpty(products)) return <Loading />;

  return (
    <section id={id} className="pt-[90px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer className="flex flex-col gap-y-5 md:gap-y-7">
        <TitleAndText title={title} text={text} className="max-w-[832px]"/>
        <Search
          label={searchLabel}
          placeholder={searchPlaceholder}
          onSearchChange={setSearchQuery}
        />
        {!isEmpty(filteredProduct) ? (
          <div className="flex flex-col border-b border-cherry">
            <div className="overflow-x-auto">
              <div className="inline-block w-full align-middle">
                <div className="overflow-y-hidden bg-white">
                  <div className="min-w-full divide-y-2 divide-white overflow-x-auto bg-white">
                    <div className="divide-y-2 divide-white">
                      {!isEmpty(filteredItems) ? (
                        <ItemsPaginated items={filteredItems} />
                      ) : (
                        <p
                          className="py-5 font-noto text-[15px] font-normal leading-[26px]
                          text-primary lg:py-10 lg:text-[18px] lg:leading-[32px]">
                          No data found.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default AvailableDownloads;
