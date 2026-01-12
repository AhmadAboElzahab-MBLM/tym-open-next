import React from 'react';
import _ from 'lodash';
import ItemsList from './items-list';

export default function Table({ data }) {
  const filteredItems = data.filter((item) => !_.isEmpty(item.properties.partsCatalog));

  return (
    <div className="flex flex-col border-b border-cherry pb-10 lg:pb-16">
      <div className="overflow-x-auto">
        <div className="inline-block w-full align-middle">
          <div className="overflow-y-hidden bg-white">
            <div className="min-w-full divide-y-2 divide-white overflow-x-auto bg-white">
              <div className="divide-y-2 divide-white">
                {filteredItems.length > 0 ? (
                  <ItemsList items={filteredItems} />
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
  );
}
