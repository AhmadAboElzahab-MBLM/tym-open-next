/* eslint-disable no-nested-ternary */
import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import { getTranslationByKey } from '@/utils/translation-helper';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import useSelectCursor from '@/hooks/use-select-cursor';
import GlobalContext from '@/context/global-context';
import reverseInToMm from '@/helpers/reverse-in-to-mm';
import Icons from '../layout/icons';
import Button from '../layout/button';

export default function ListView({ data, compareMachinesData, isParent }) {
  const { translations, lang } = useContext(GlobalContext);
  const langMapping = {
    en: { value: 'valueMetric', unit: 'unitMetric', value2: 'valueUS', unit2: 'unitUS' },
    'en-us': { value: 'valueMetric', unit: 'unitMetric', value2: 'valueUS', unit2: 'unitUS' },
    'en-ko': { value: 'valueMetric', unit: 'unitMetric', value2: 'valueUS', unit2: 'unitUS' },
    ko: { value: 'valueMetric', unit: 'unitMetric', value2: 'valueUS', unit2: 'unitUS' },
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

  const { toggleCursor } = useSelectCursor();

  useEffect(() => {
    toggleCursor(false);
    return () => toggleCursor(false);
  }, []);

  const modifyTitle = (title) => {
    const numbersToCheck = ['3515C', '4215C', '4815C'];
    if (numbersToCheck.some((num) => title?.includes(num))) {
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

  const transformedString = (inputString) =>
    inputString.replace(/[a-zA-Z0-9&]+('[a-z])?/g, (word) => {
      if (word.length > 3) return _.capitalize(word);
      return word;
    });

  const specifications = _.get(data, 'properties.specifications.items', []);
  const downloadables = _.get(data, 'properties.downloadables', []);
  const brochure = _.find(downloadables, ['properties.technicalBrochure', true]);
  const productCategory = _.get(data, 'properties.category', '');
  const requestQuote = { title: 'REQUEST QUOTE', route: { path: '/en/products/request-quote/' } };
  const series = _.get(data, 'properties.series', '');
  resolveInternalLinks(requestQuote, lang);

  return (
    <div className="flex flex-col gap-y-[40px] overflow-x-auto">
      <div className="flex flex-col gap-y-[20px]">
        <table className="w-full table-fixed">
          <tbody>
            {uniqueCategories.map((category, index) => {
              const filteredSpecs = _.filter(specifications, (spec) => {
                const specCategory = _.get(spec, 'content.properties.category', '');
                return _.isEqual(specCategory, category);
              });

              return (
                <tr key={index}>
                  <td className="pt-[28px]">
                    <table className="w-full">
                      <tr>
                        <th>
                          <h5
                            className="pb-5 text-left font-noto text-[15px] font-bold
                          leading-[24px] text-black">
                            {getTranslationByKey(transformedString(category), translations, lang)}
                          </h5>
                        </th>
                      </tr>
                      {category === 'ENGINE' && (
                        <tr className="border border-grey">
                          <td
                            className="flex w-full px-[22px] pb-[21px] pt-[19px]
                          font-noto text-[15px] font-normal leading-[24px] text-primary">
                            {getTranslationByKey(
                              `${data.properties.category} Model`,
                              translations,
                              lang,
                            )}
                          </td>
                          <td
                            data-isParent={isParent}
                            className="px-[22px] pb-[21px] pt-[19px]
                          font-noto text-[15px] leading-[24px] data-[isParent=false]:font-bold
                          data-[isParent=false]:text-cherry text-cherry font-bold">
                            {/* <Link href={_.get(data, 'url', '#')}> */}
                            <div>
                              {modifyTitle(_.get(data, 'properties.title'))}
                              {_.isNil(
                                _.get(data, 'properties.navigationThumbSideImage[0].url'),
                              ) ? (
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
                                      className="!relative !h-auto !w-auto !object-contain
                                    lg:!h-[120px]"
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
                                    className="!relative !h-auto !w-auto !object-contain
                                  lg:!h-[120px]"
                                  />
                                </div>
                              )}
                            </div>
                            {/* </Link> */}
                          </td>
                          {_.map(compareMachinesData, (machineArr, i) => {
                            const imageSrc = _.get(
                              machineArr,
                              'properties.navigationSideImage[0].url',
                              '/default-image-url',
                            );
                            return (
                              <td
                                key={i}
                                className="px-[22px] py-[21px] font-noto text-[15px] leading-[24px]
                              text-primary">
                                {/* <Link href={_.get(machineArr, 'url', '#')}> */}
                                <div>
                                  {_.get(machineArr, 'properties.title')}
                                  {_.isNil(
                                    _.get(machineArr, 'properties.navigationThumbSideImage[0].url'),
                                  ) ? (
                                    _.isEmpty(machineArr.properties.featuresImage) ? null : (
                                      <div
                                        className="pt-[20px]"
                                        // onMouseEnter={() => toggleCursor(true)}
                                        // onMouseLeave={() => toggleCursor(false)}>
                                      >
                                        <Image
                                          src={_.get(machineArr, 'properties.featuresImage[0].url')}
                                          alt={_.get(machineArr, 'properties.title')}
                                          fill
                                          loading="lazy"
                                          className="!relative !h-auto !w-auto !object-contain
                                    lg:!h-[120px]"
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
                                        src={_.get(
                                          machineArr,
                                          'properties.navigationThumbSideImage[0].url',
                                        )}
                                        alt={_.get(machineArr, 'properties.title')}
                                        fill
                                        loading="lazy"
                                        className="!relative !h-auto !w-auto !object-contain
                                  lg:!h-[120px]"
                                      />
                                    </div>
                                  )}
                                </div>
                                {/* </Link> */}
                              </td>
                            );
                          })}
                        </tr>
                      )}
                      {_.map(filteredSpecs, (spec, idx) => {
                        const labelText = _.get(spec, 'content.properties.valueText', '');
                        const labelValue = getLabelValue(spec);
                        const specTitle = _.get(spec, 'content.properties.title', '');
                        const valueMetric = _.get(spec, 'content.properties.valueMetric', '');
                        const valueSpecText = _.get(spec, 'content.properties.valueText', '');
                        const valueSpecOpt2 = _.get(spec, 'content.properties.option2', '');

                        let displayValue;
                        
                         if (
                          productCategory === 'Diesel Engines' &&
                          lang === 'en' &&
                          specTitle === 'Engine power'
                        ) {
                          displayValue = `${valueMetric} hp`;
                        } else if (
                          productCategory === 'Diesel Engines' &&
                          (lang === 'en-ko' || lang === 'ko') &&
                          specTitle === 'Engine power'
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
                          <tr key={idx} className="border border-grey">
                            <td
                              className="w-[30%] px-3 py-5 font-noto
                              text-[15px] font-normal leading-[24px] text-primary">
                              {getTranslationByKey(specTitle, translations, lang)}
                            </td>
                            <td
                              data-isParent={isParent}
                              className="w-[210px] px-3 py-5
                              font-noto text-[15px] leading-[24px] data-[isParent=false]:font-bold
                              data-[isParent=false]:text-cherry text-cherry font-bold">
                              {displayValue}
                            </td>
                            {_.map(compareMachinesData, (machine, index2) => {
                              const specs = _.get(machine, 'properties.specifications.items', []);
                              const compareCategory = _.get(machine, 'properties.category', '');
                              const machineSpec = _.find(specs, (item) => {
                                const currTitle = _.get(item, 'content.properties.title', '');
                                return _.isEqual(currTitle, specTitle);
                              });
                              const labelText2 = _.get(
                                machineSpec,
                                'content.properties.valueText',
                                '',
                              );
                              const labelValue2 = getLabelValue(machineSpec);
                              const compareValueMetric = _.get(
                                machineSpec,
                                'content.properties.valueMetric',
                                '',
                              );
                              let displayValue2;
                              if (
                                compareCategory === 'Diesel Engines' &&
                                lang === 'en' &&
                                specTitle === 'Engine power'
                              ) {
                                displayValue2 = `${compareValueMetric} hp`;
                              } else if (
                                compareCategory === 'Diesel Engines' &&
                                (lang === 'en-ko' || lang === 'ko') &&
                                specTitle === 'Engine power'
                              ) {
                                displayValue2 = `${compareValueMetric} PS`;
                              } else {
                                displayValue2 = _.isNil(labelValue2) ? (
                                  <div dangerouslySetInnerHTML={{ __html: labelText2 }} />
                                ) : (
                                  <span>{labelValue2}</span>
                                );
                              }
                              return (
                                <td
                                  key={`${idx}_${index2}`}
                                  className="w-[210px] px-3 py-5 font-noto
                                  text-[15px] font-normal leading-[24px] text-primary">
                                  {displayValue2}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </table>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className="pt-7">
                <table className="w-full">
                  <tr className={`${series === 'John Deere' ? '' : 'border border-grey'}`}>
                    <td
                      className="w-[30%] px-3 pb-[21px] pt-[19px] font-noto
                        text-[15px] font-normal leading-[24px] text-primary">
                      {series !== 'John Deere' &&
                        getTranslationByKey('Download', translations, lang)}
                    </td>
                    {series === 'John Deere' ? (
                      <td
                        className="w-[210px] font-noto
                          text-[15px] font-normal leading-[24px] text-primary">
                        <Button
                          label={getTranslationByKey(requestQuote.title, translations, lang)}
                          url={`${requestQuote.url}?category=${productCategory}&model=${modifyTitle(_.get(data, 'properties.title'))}`}
                          variant="primaryCherry"
                          text="!px-2 !max-w-[140px] !min-h-[30px] md:!min-h-[40px] !h-[30px] md:!h-[40px] !text-[13px] !text-[8px] md:text-clamp14to15 !whitespace-normal md:whitespace-pre"
                        />
                      </td>
                    ) : (
                      !_.isEmpty(_.get(data, 'properties.downloadables')) && (
                        <td
                          className="w-[210px] px-3 py-5 font-noto
                              text-[15px] font-normal leading-[24px] text-primary">
                          {_.isEmpty(brochure) ? (
                            '-'
                          ) : (
                            <Link
                              href={brochure.url || '#'}
                              className="flex w-fit items-center gap-x-[6px] font-noto
                                    text-[15px] font-normal text-primary underline"
                              target="_blank">
                              <Icons name="ArrowDown" />{' '}
                              {getTranslationByKey('Technical Brochure', translations, lang)}
                            </Link>
                          )}
                        </td>
                      )
                    )}
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
                        <td
                          key={index}
                          className={`${series === 'John Deere' ? '' : 'px-3 py-5 leading-[24px]'} w-[210px] font-noto
                            text-[15px] font-normal text-primary`}>
                          {series === 'John Deere' ? (
                            <Button
                              label={getTranslationByKey(requestQuote.title, translations, lang)}
                              url={`${requestQuote.url}?category=${productCategory}&model=${title}`}
                              variant="primaryCherry"
                              text="!px-2 !max-w-[140px] !min-h-[30px] md:!min-h-[40px] !h-[30px] md:!h-[40px] !text-[13px] !text-[8px] md:text-clamp14to15 !whitespace-normal md:whitespace-pre"
                            />
                          ) : _.isEmpty(valBrochure) ? (
                            '-'
                          ) : (
                            <Link
                              href={valBrochure?.url || '#'}
                              className="flex items-center gap-x-[6px] font-noto text-[15px]
                                    font-normal text-primary underline"
                              target="_blank">
                              <Icons name="ArrowDown" />{' '}
                              {getTranslationByKey('Technical Brochure', translations, lang)}
                            </Link>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
