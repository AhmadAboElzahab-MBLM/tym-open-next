import React, { useState } from 'react';
import { motion } from 'framer-motion';
import _ from 'lodash';
import BoxedContainer from '../layout/boxed-container';
import Filter from './filter';
import ItemsList from './items-list';

export default function SelfService({ data, id }) {
  const title = _.get(data, 'properties.title', '');
  const text = _.get(data, 'properties.text.markup', '');
  const items = _.get(data, 'properties.items.items', []);
  const [selectedFilter, setSelectedFilter] = useState('Tractors');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const groupedItems = _.groupBy(items, 'content.properties.category');
  const filterOptions = _.keys(groupedItems);

  const selfServiceCategory = _.chain(groupedItems[selectedFilter])
    .map('content.properties.selfServiceCategory')
    .uniq()
    .value();

  const filteredItems = _.filter(groupedItems[selectedFilter], (item) => {
    if (selectedCategory === 'All') return true;
    return _.includes(item.content.properties.selfServiceCategory, selectedCategory);
  });

  const handleFilterChange = (val) => {
    setSelectedFilter((prev) => {
      if (prev !== val) setSelectedCategory('All');
      return val;
    });
  };

  return (
    <section id={id} className="bg-white pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <div className="flex flex-col gap-y-[30px] md:gap-y-[48px]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex max-w-[928px] flex-col gap-y-[15px] md:gap-y-[20px] lg:gap-y-[32px]">
            <div
              className="max-w-[780px] text-clamp32to48 font-bold uppercase leading-1.5 text-[#000]
              md:leading-[45px] lg:leading-[54px]">
              {title}
            </div>
            {_.isEmpty(text) || (
              <div
                className="flex flex-col gap-y-[15px] font-noto text-[12px] font-normal
                leading-1.625 text-[#000] md:gap-y-[32px] lg:text-[18px] lg:leading-[32px]"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col">
            <div>
              <Filter
                selfServiceCategory={selfServiceCategory}
                filterOptions={filterOptions}
                setSelectedFilter={handleFilterChange}
                selectedFilter={selectedFilter}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
            {_.isEmpty(filteredItems) ? (
              <p
                className="py-5 font-noto text-[15px] font-normal leading-[26px] text-primary
                lg:py-10 lg:text-[18px] lg:leading-[32px]">
                No data found.
              </p>
            ) : (
              <ItemsList items={filteredItems} />
            )}
          </motion.div>
        </div>
        <div className="h-[1px] w-full bg-cherry lg:mt-[60px]" />
      </BoxedContainer>
    </section>
  );
}
