import React from 'react';
import _ from 'lodash';
import useMaxWidthFromElements from '@/hooks/use-max-width-from-elements';
import FilterButton from '@/components/layout/filter-button';
import SelectorOption from '@/components/layout/selector-option';

function Filter({
  filters,
  // selectors,
  handleOpenModal,
  // selected,
  filterLabel,
  selectedFilters,
  // onSelect,
}) {
  // const [maxWidth, setRefs] = useMaxWidthFromElements();

  return (
    <div className="flex flex-col gap-y-4 py-4 lg:gap-y-8 lg:py-6">
      <span className="font-noto text-clamp14to15 font-bold uppercase tracking-[1.5px]
      text-primary">
        {filterLabel}
      </span>
      <div className="flex flex-wrap justify-between gap-5 pb-1 md:pb-6 lg:justify-start">
        {_.map(filters, (val, ind) => (
          <FilterButton
            handleFilter={handleOpenModal}
            item={_.startCase(val)}
            key={ind}
            isSelected={!_.isEmpty(selectedFilters[val])}
          />
        ))}
      </div>
      {/*
      <div
        className="flex flex-nowrap gap-x-8 gap-y-2 md:gap-y-4 xl:border-b 3xl:gap-x-12 4xl:gap-x-16
        border-cherry flex-col xl:flex-row">
        {_.map(selectors, (val, ind) => (
          <SelectorOption
            key={ind}
            item={val}
            maxWidth={maxWidth}
            ref={setRefs}
            selected={selected}
            onSelect={onSelect}
          />
        ))}
      </div>
      */}
    </div>
  );
}

export default Filter;
