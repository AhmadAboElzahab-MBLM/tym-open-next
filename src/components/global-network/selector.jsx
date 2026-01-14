import React from 'react';
import useMaxWidthFromElements from '@/hooks/use-max-width-from-elements';
import SelectorOption from '@/components/layout/selector-option';

function Selector({ selectors, view, onSelect, defaultValue }) {
  const [maxWidth, setRefs] = useMaxWidthFromElements();

  return (
    <div className="flex flex-col gap-y-4 py-4 lg:gap-y-8 lg:py-6">
      <div
        className="flex flex-wrap items-end gap-5 border-b border-cherry md:gap-x-8 lg:gap-x-12
        xl:gap-x-16 2xl:gap-x-20">
        <SelectorOption
          item={selectors}
          maxWidth={maxWidth}
          ref={setRefs}
          view={view}
          onSelect={onSelect}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
}

export default Selector;
