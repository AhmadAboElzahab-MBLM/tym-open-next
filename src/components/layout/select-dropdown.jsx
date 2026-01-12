import React, { useCallback, useMemo, useContext } from 'react';
import Select from 'react-select';
import Icons from '@/components/layout/icons';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';

export default function SelectDropdown({
  items,
  onSelect,
  placeholder,
  defaultValue,
  selectedValue,
  partsFilter,
}) {
  const { translations, lang } = useContext(GlobalContext);
  const options = useMemo(() => {
    const uniqueItems = [...new Set(items)];
    const formattedOptions = uniqueItems
      .map((list) => ({
        value: list,
        label: getTranslationByKey(list, translations, lang),
      }))
      .filter((option) => option.label !== null);
    if (selectedValue !== defaultValue) {
      formattedOptions.unshift({
        value: defaultValue,
        label: getTranslationByKey(defaultValue, translations, lang),
      });
    }
    return formattedOptions;
  }, [items, selectedValue, defaultValue]);

  const defaultOption = {
    label: getTranslationByKey(defaultValue, translations, lang),
    value: defaultValue,
  };

  const DropdownIndicator = useCallback(
    () => <Icons name="DownArrow" className="text-primary" />,
    [],
  );
  const components = useMemo(() => ({ DropdownIndicator }), [DropdownIndicator]);

  const control = useCallback(
    () => `w-full bg-[transparent] gap-x-2 px-1 pb-3 flex justify-center grow items-center
    font-noto !cursor-pointer flex-row text-clamp14to15 relative font-bold text-center text-primary
      ${
        partsFilter
          ? 'border-b border-gray'
          : 'border-b-4 border-primary uppercase tracking-[1.5px] !min-w-[170px]'
      }
      `,
    [],
  );
  const clearIndicator = useCallback(() => 'hidden', []);

  const menu = useCallback(
    () =>
      `flex flex-col absolute w-56 lg:w-64 bg-white shadow-md h-auto menu--open bg-white
      !min-w-fit font-noto`,
    [],
  );

  const input = useCallback(() => 'opacity-0 absolute', []);

  const option = useCallback(
    (
      state,
    ) => `w-full flex px-[1rem] !text-clamp14to15 leading-1.5 flex-row py-2 font-bold items-center
    !cursor-pointer transition-all justify-center text-left whitespace-pre
    ${partsFilter ? 'font-noto' : 'uppercase'}
    ${state.isSelected ? 'text-cherry bg-neutral-100' : ''}
    ${state.isFocused ? 'bg-neutral-200' : ''}`,
    [defaultValue],
  );

  const menuList = useCallback(() => 'w-full h-full', []);

  const valueContainer = useCallback(() => 'absolute opacity-100', []);

  const classNames = {
    control,
    clearIndicator,
    menu,
    input,
    option,
    menuList,
    valueContainer,
  };

  // console.log(selectedValue);

  return (
    <Select
      id="dropdown-menu"
      unstyled
      placeholder={placeholder}
      classNames={classNames}
      value={selectedValue}
      options={options}
      components={components}
      onChange={(_option) => onSelect(_option.value)}
      defaultValue={defaultOption}
      menuPlacement="bottom"
      isSearchable={false}
    />
  );
}
