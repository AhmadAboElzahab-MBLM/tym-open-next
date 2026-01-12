import _ from 'lodash';
import React from 'react';
import BoxedContainer from '@/components/layout/boxed-container';
import DataTableDesktop from './data-table-desktop';
import DataTableMobile from './data-table-mobile';

export default function DataTable({ data }) {
  const text = _.get(data, 'properties.text.markup', '');
  const tableTitle = _.get(data, 'properties.tableTitle.markup', '');
  const items = _.get(data, 'properties.items', null);
  return (
    <section id="data-table" className="mt-6 bg-porcelain py-8 md:mt-8 md:py-14">
      <BoxedContainer className="flex flex-col gap-7">
        <div className="flex flex-col gap-3 md:px-4 lg:gap-5">
          {_.isEmpty(text) || (
            <div
              className="flex w-full flex-col gap-y-2 font-noto text-clamp14to18
          leading-1.77 md:gap-y-8 lg:text-center lg:leading-2"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
          {_.isEmpty(tableTitle) || (
            <div
              className="flex w-full flex-col gap-y-4 font-noto text-clamp14to18
          leading-1.77 md:gap-y-8 lg:text-center lg:leading-2"
              dangerouslySetInnerHTML={{ __html: tableTitle }}
            />
          )}
        </div>
        {_.isEmpty(items) || <DataTableDesktop data={items} />}
        {_.isEmpty(items) || <DataTableMobile data={items} />}
      </BoxedContainer>
    </section>
  );
}
