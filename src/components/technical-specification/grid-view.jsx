/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect } from 'react';
import _, { lowerFirst } from 'lodash';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';
import useSelectCursor from '@/hooks/use-select-cursor';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import reverseInToMm from '@/helpers/reverse-in-to-mm';
import Icons from '../layout/icons';
import Button from '../layout/button';

export default function GridView({ data, compareMachinesData, isParent }) {
  const { translations, lang } = useContext(GlobalContext);
  const langMapping = {
    en: { value: 'valueMetric', unit: 'unitMetric', value2: 'valueUS', unit2: 'unitUS' },
    'en-us': { value: 'valueMetric', unit: 'unitMetric', value2: 'valueUS', unit2: 'unitUS' },
    'en-ko': { value: 'valueMetric', unit: 'unitMetric', value2: 'valueUS', unit2: 'unitUS' },
    ko: { value: 'valueMetric', unit: 'unitMetric', value2: 'valueUS', unit2: 'unitUS' },
    de: { value: 'valueMetric', unit: 'unitMetric', value2: 'valueUS', unit2: 'unitUS' },
  };
  const specialLangMapping = {
    'en-us': { value: 'valueUS', unit: 'unitUS', value2: 'valueMetric', unit2: 'unitMetric' },
  };

  const specialTitles = [
    'Hitch lift capacity',
    'Displacement',
    'Fuel tank',
    'Overall length with 3-point hitch',
    'Overall width',
    'Wheelbase',
    'Height to top of ROPS',
    'Min. ground clearance',
    'Weight with ROPS',
    'Weight with cab',
    'Coolant',
    'Crankcase',
    'Transmission/Hydraulics system',
    'Implement flow',
    'Steering flow',
    'Total flow',
    'Front axle',
    'Hitch lift capacity at 24 inches behind link ends',
    'Min. turn radius with brakes',
    'Min. turn radius without brakes',
    'Height to top of cabin',
    'Max. traveling speed',
  ];

  const getLabelValue = (spec) => {
    const title = _.get(spec, 'content.properties.title', '');
    const isSpecialTitle = specialTitles.includes(title);

    const { value, unit, value2, unit2 } = isSpecialTitle
      ? specialLangMapping[lang] || langMapping[lang]
      : langMapping[lang];

    const valueLabel = _.get(spec, `content.properties.${value}`, null);
    let unitLabel = _.get(spec, `content.properties.${unit}`, null) || '';

    if (unitLabel === 'ps') {
      unitLabel = 'PS';
    }

    const valueLabel2 = _.get(spec, `content.properties.${value2}`, null);
    const unitLabel2 = _.get(spec, `content.properties.${unit2}`, null) || '';

    if (_.isNil(valueLabel)) return null;
    if (_.isNil(valueLabel2)) return _.trim(`${valueLabel} ${unitLabel}`);
    return _.trim(`${valueLabel} ${unitLabel} | ${valueLabel2} ${unitLabel2}`);
  };

  resolveInternalLinks(data, lang);

  _.forEach(compareMachinesData, (item) => {
    resolveInternalLinks(item, lang);
  });

  const [activeTab, setActiveTab] = useState(-1);
  const { toggleCursor } = useSelectCursor();

  useEffect(() => {
    toggleCursor(false);
    return () => toggleCursor(false);
  }, []);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const modifyTitle = (title) => {
    const numbersToCheck = ['3515C', '4215C', '4815C'];
    if (_.some(numbersToCheck, (num) => _.includes(title, num))) {
      return `${title}H`;
    }
    return title;
  };

  const uniqueCategories = _.uniq(
    _.map(_.get(data, 'properties.specifications.items', []), (item) =>
      _.get(item, 'content.properties.category'),
    ),
  );

  const swapElements = (arr, index1, index2) => {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
  };

  const hydraulicIndex = uniqueCategories.indexOf('HYDRAULIC SYSTEM');
  const powertrainIndex = uniqueCategories.indexOf('POWERTRAIN');

  if (hydraulicIndex !== -1 && powertrainIndex !== -1) {
    swapElements(uniqueCategories, hydraulicIndex, powertrainIndex);
  }

  const specsItems = _.get(data, 'properties.specifications.items', []);
  const overviewItems = _.filter(specsItems, (item) => _.get(item, 'content.properties.featured'));
  const requestQuote = { title: 'REQUEST QUOTE', route: { path: '/en/products/request-quote/' } };
  const series = _.get(data, 'properties.series', '');
  resolveInternalLinks(requestQuote, lang);

  const filteredItems =
    activeTab === -1
      ? overviewItems
      : _.filter(
          _.get(data, 'properties.specifications.items', []),
          (item) =>
            _.get(item, 'content.properties.category') ===
            _.get(uniqueCategories, `[${activeTab}]`),
        );

  const transformedString = (inputString) =>
    inputString.replace(/[a-zA-Z0-9&]+('[a-z])?/g, (word) => {
      if (word.length > 3) return _.capitalize(word);
      return word;
    });

  const downloadables = _.get(data, 'properties.downloadables', []);
  const brochure = _.find(downloadables, ['properties.technicalBrochure', true]);
  const category = _.get(data, 'properties.category', '');

  return (
    <div className="pt-[32px]">
      <div className="flex flex-row flex-wrap lg:flex-nowrap">
        <button
          type="button"
          className={
            activeTab === -1
              ? `border-b border-l border-r border-t border-grey bg-white px-3 py-3
              font-noto text-[15px] font-bold text-cherry lg:mb-[-1px] lg:border-b-transparent
              lg:py-[19px]`
              : 'border border-white bg-white px-[12px] py-3 font-noto lg:py-[19px]'
          }
          onClick={() => handleTabClick(-1)}>
          {getTranslationByKey('Overview', translations, lang)}
        </button>
        {_.map(uniqueCategories, (item, index) => (
          <button
            key={index}
            type="button"
            className={
              activeTab === index
                ? `border-b border-l border-r border-t border-grey bg-white px-3
                py-3 font-noto text-[15px] font-bold text-cherry lg:mb-[-1px]
                lg:border-b-transparent lg:px-[18px] lg:py-[19px]`
                : `border border-white bg-white px-3 py-3 font-noto text-[15px]
                lg:px-[18px] lg:py-[19px]`
            }
            onClick={() => handleTabClick(index)}>
            {getTranslationByKey(transformedString(item), translations, lang)}
          </button>
        ))}
      </div>
      <div className="w-full">
        <table className="w-full table-fixed">
          <tbody className="border border-grey">
            <tr className="border-b border-grey">
              <td
                className="flex w-full px-[12px] pb-[21px] pt-[19px]
                  font-noto text-clamp12to15 font-normal leading-[24px] text-primary">
                {getTranslationByKey(`${data.properties.category} Model`, translations, lang)}
              </td>
              <td
                data-isparent={isParent}
                className="px-[12px] pb-[21px] pt-[19px]
                font-noto text-clamp12to15 leading-[24px] data-[isParent=false]:font-bold
                data-[isParent=false]:text-cherry">
                {/* <Link href={_.get(data, 'url', '#')}> */}
                <div className="text-cherry font-bold">
                  {modifyTitle(_.get(data, 'properties.title'))}
                  {_.isNil(_.get(data, 'properties.navigationThumbSideImage[0].url')) ? (
                    _.isEmpty(data.properties.featuresImage) ? null : (
                      <div
                        className="pt-[20px]"
                        // onMouseEnter={() => toggleCursor(true)}
                        // onMouseLeave={() => toggleCursor(false)}>
                      >
                        <Image
                          src={_.get(data, 'properties.featuresImage[0].url')}
                          alt={_.get(data, 'properties.title')}
                          fill
                          loading="lazy"
                          className="!relative !h-auto !w-auto !object-contain lg:!h-[120px]"
                        />
                      </div>
                    )
                  ) : (
                    <div
                      className="pt-[20px]"
                      // onMouseEnter={() => toggleCursor(true)}
                      // onMouseLeave={() => toggleCursor(false)}>
                    >
                      <Image
                        src={_.get(data, 'properties.navigationThumbSideImage[0].url')}
                        alt={_.get(data, 'properties.title')}
                        fill
                        loading="lazy"
                        className="!relative !h-auto !w-auto !object-contain lg:!h-[120px]"
                      />
                    </div>
                  )}
                </div>
                {/* </Link> */}
              </td>
              {_.map(compareMachinesData, (item, i) => (
                <td
                  key={i}
                  className="px-[12px] pb-[21px] pt-[19px] font-noto text-clamp12to15
                  leading-[24px] text-primary">
                  {/* <Link href={_.get(item, 'url', '#')}> */}
                  <div>
                    {_.get(item, 'properties.title')}
                    {_.isNil(_.get(item, 'properties.navigationSideImage[0].url')) ? (
                      _.isEmpty(item.properties.featuresImage) ? null : (
                        <div
                          className="pt-[20px]"
                          // onMouseEnter={() => toggleCursor(true)}
                          // onMouseLeave={() => toggleCursor(false)}>
                        >
                          <Image
                            src={_.get(item, 'properties.featuresImage[0].url')}
                            alt={_.get(item, 'properties.title')}
                            fill
                            loading="lazy"
                            className="!relative !h-auto !w-auto !object-contain lg:!h-[120px]"
                          />
                        </div>
                      )
                    ) : (
                      <div
                        className="pt-[20px]"
                        // onMouseEnter={() => toggleCursor(true)}
                        // onMouseLeave={() => toggleCursor(false)}>
                      >
                        <Image
                          src={_.get(item, 'properties.navigationThumbSideImage[0].url')}
                          alt={_.get(item, 'properties.title')}
                          fill
                          loading="lazy"
                          className="!relative !h-auto !w-auto !object-contain lg:!h-[120px]"
                        />
                      </div>
                    )}
                  </div>
                  {/* </Link> */}
                </td>
              ))}
            </tr>

            {_.map(filteredItems, (item, index) => {
              const labelText = _.get(item, 'content.properties.valueText', '');
              const labelValue = getLabelValue(item);
              const itemTitle = _.get(item, 'content.properties.title', '');
              const valueMetric = _.get(item, 'content.properties.valueMetric', '');
              const valueText = _.get(item, 'content.properties.valueText', '');
              const valueSpecOpt2 = _.get(item, 'content.properties.option2', '');
              let displayValue;

              if (
                category === 'Diesel Engines' &&
                lang === 'en' &&
                itemTitle === 'Engine power'
              ) {
                displayValue = `${valueMetric} hp`;
              } else if (
                category === 'Diesel Engines' &&
                (lang === 'en-ko' || lang === 'ko') &&
                itemTitle === 'Engine power'
              ) {
                displayValue = `${valueMetric} PS`;
              } else {
                displayValue = _.isNil(labelValue) ? (
                  <div dangerouslySetInnerHTML={{ __html: labelText }} />
                ) : (
                  <>
                  <div dangerouslySetInnerHTML={{ __html: labelValue}} />
                  {valueSpecOpt2 && valueSpecOpt2}
                  </>
                );
              }

              return (
                <tr key={index} className="border-b border-grey">
                  <td
                    className="w-[25%] px-3 py-5 font-noto text-clamp12to15
                    font-normal leading-[24px] text-primary">
                    {_.isEmpty(itemTitle) || (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: getTranslationByKey(
                            _.get(item, 'content.properties.title', ''),
                            translations,
                            lang,
                          ),
                        }}
                      />
                    )}
                  </td>
                  <td
                    data-isparent={isParent}
                    className="min-w-[250px] px-3 py-5
                    font-noto text-clamp12to15 leading-1.625 data-[isParent=false]:font-bold
                  data-[isParent=false]:text-cherry text-cherry font-bold">
                    {displayValue}
                  </td>
                  {_.map(compareMachinesData, (machineArr, i) => {
                    const specifications = _.get(machineArr, 'properties.specifications.items', []);
                    const compareCategory = _.get(machineArr, 'properties.category', '');

                    const matchedSpec = _.find(specifications, (spec) => {
                      const specTitle = _.get(spec, 'content.properties.title', '');
                      return _.isEqual(specTitle, itemTitle);
                    });

                    const labelValue2 = getLabelValue(matchedSpec);
                    const valueText = _.get(matchedSpec, 'content.properties.valueText', '-');
                    const compareValueMetric = _.get(
                      matchedSpec,
                      'content.properties.valueMetric',
                      '',
                    );
                    let displayValue2;

                    if (
                      compareCategory === 'Diesel Engines' &&
                      lang === 'en' &&
                      itemTitle === 'Engine power'
                    ) {
                      displayValue2 = `${compareValueMetric} hp`;
                    } else if (
                      compareCategory === 'Diesel Engines' &&
                      (lang === 'en-ko' || lang === 'ko') &&
                      itemTitle === 'Engine power'
                    ) {
                      displayValue2 = `${compareValueMetric} PS`;
                    } else {
                      displayValue2 = _.isNil(labelValue2) ? (
                        <div dangerouslySetInnerHTML={{ __html: valueText }} />
                      ) : (
                        <span>{labelValue2}</span>
                      );
                    }

                    return (
                      <td
                        key={`${index}_${i}`}
                        className="min-w-[250px] px-3 py-5 font-noto text-clamp12to15 leading-1.625 text-primary">
                        {displayValue2}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            <tr>
              <td
                className="w-1/2 px-3 pb-[21px] pt-[19px] font-noto
                  text-clamp12to15 font-normal leading-[24px] text-primary">
                {series !== 'John Deere' && getTranslationByKey('Download', translations, lang)}
              </td>

              <td>
                {series === 'John Deere' ? (
                  _.get(data, 'properties.title') === '5075E' ? (
                    <Link
                      href={brochure?.url || '#'}
                      className="flex w-fit items-center gap-x-[6px] font-noto text-clamp12to15
                          font-normal text-primary underline"
                      target="_blank">
                      <Icons name="ArrowDown" className="min-w-[12px]" />{' '}
                      {getTranslationByKey('Technical Brochure', translations, lang)}
                    </Link>
                  ) : (
                    <Button
                      label={getTranslationByKey(requestQuote.title, translations, lang)}
                      url={`${requestQuote.url}?category=${category}&model=${modifyTitle(_.get(data, 'properties.title'))}`}
                      variant="primaryCherry"
                      text="!px-2 !max-w-[140px] w-full !min-h-[30px] md:!min-h-[40px] !h-[30px] md:!h-[40px] !text-[13px] !text-[8px] md:text-clamp14to15 !whitespace-normal md:whitespace-pre"
                    />
                  )
                ) : _.isEmpty(brochure) ? (
                  '-'
                ) : (
                  <Link
                    href={brochure?.url || '#'}
                    className="flex w-fit items-center gap-x-[6px] font-noto text-clamp12to15
                        font-normal text-primary underline"
                    target="_blank">
                    <Icons name="ArrowDown" className="min-w-[12px]" />{' '}
                    {getTranslationByKey('Technical Brochure', translations, lang)}
                  </Link>
                )}
              </td>

              {_.map(compareMachinesData, (val, index) => {
                const title = _.get(val, 'name', '');
                const requestQuote = {
                  title: 'REQUEST QUOTE',
                  route: { path: '/en/products/request-quote/' },
                };
                const series = _.get(val, 'properties.series', '');
                resolveInternalLinks(requestQuote, lang);

                const valDownloadables = _.get(val, 'properties.downloadables', []);
                const valBrochure =
                  _.find(valDownloadables, ['properties.technicalBrochure', true]) ||
                  _.head(valDownloadables);

                return (
                  <td key={index} className="min-w-[250px]">
                    {series === 'John Deere' ? (
                      <Button
                        label={getTranslationByKey(requestQuote.title, translations, lang)}
                        url={`${requestQuote.url}?category=${category}&model=${title}`}
                        variant="primaryCherry"
                        text="!px-2 !max-w-[140px] w-full !min-h-[30px] md:!min-h-[40px] !h-[30px] md:!h-[40px] !text-[13px] !text-[8px] md:text-clamp14to15 !whitespace-normal md:whitespace-pre"
                      />
                    ) : _.isEmpty(valBrochure) ? (
                      '-'
                    ) : (
                      <Link
                        href={valBrochure?.url || '#'}
                        className="flex items-center gap-x-[6px] font-noto text-clamp12to15
                              font-normal text-primary underline"
                        target="_blank">
                        <Icons name="ArrowDown" className="min-w-[12px]" />{' '}
                        {getTranslationByKey('Technical Brochure', translations, lang)}
                      </Link>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
