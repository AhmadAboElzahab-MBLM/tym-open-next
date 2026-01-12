import React, { useContext } from 'react';
import _ from 'lodash';
import FilterButton from '@/components/layout/filter-button';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

function Filter({ filters, handleOpenModal, filterLabel, selected }) {
  const { translations, lang } = useContext(GlobalContext);
  return (
    <div className="flex flex-col gap-y-4 py-4 lg:gap-y-8 lg:py-6">
      <span className="font-noto text-clamp14to15 font-bold uppercase
      tracking-[1.5px] text-primary">
        {getTranslationByKey(filterLabel, translations, lang)}
      </span>
      <div className="flex flex-wrap justify-between gap-5 pb-1 md:pb-6 lg:justify-start">
        {_.map(filters, (val, ind) => (
            <FilterButton
              handleFilter={handleOpenModal}
              item={val.title}
              key={ind}
              isSelected={!_.isEmpty(selected[val.title])}
            />
          ))}
      </div>
    </div>
  );
}

export default Filter;
