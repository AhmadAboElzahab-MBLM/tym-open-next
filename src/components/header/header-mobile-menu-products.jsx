import React, { useEffect, useState, useContext } from 'react';
import _ from 'lodash';
import Image from 'next/image';
import { groupProductsByCategoryAndSubcategory } from '@/helpers/product-handlers';
import Link from 'next/link';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';
import resolveInternalLinks from '@/helpers/resolve-url-locale';

function getPowerLabel(val, lang, category) {
  const specs = _.get(val, 'properties.specifications.items', []);

  let value = '';

  specs.forEach((curr) => {
    const title = _.get(curr, 'content.properties.title');
    const valueMetric = _.get(curr, 'content.properties.valueMetric');

    if (
      category === 'Diesel Engines' &&
      title === 'Engine power' &&
      (lang === 'en' || lang === 'en-ko' || lang === 'ko')
    ) {
      if (lang === 'en') {
        value = `${valueMetric} hp`;
      } else {
        value = `${valueMetric} PS`;
      }
    } else if (title === 'Engine power') {
      // const valueUS = _.get(curr, 'content.properties.valueUS');
      // const unitUS = _.get(curr, 'content.properties.unitUS');
      const unitMetric = _.get(curr, 'content.properties.unitMetric');

      const langMapping = {
        en: `${valueMetric} ${unitMetric}`,
        'en-us': `${valueMetric} ${unitMetric}`,
        'en-ko': `${valueMetric} ${unitMetric}`,
        ko: `${valueMetric} ${unitMetric}`,
        de: `${valueMetric} ${unitMetric}`,
      };

      value += langMapping[lang];
    }
  });

  return value;
}

function HeaderMobileMenuProducts({ data, handleViewChange, products, productsCategoryLinks }) {
  const { translations, lang } = useContext(GlobalContext);
  const [category, setCategory] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [filteredSeriesItems, setFilteredSeriesItems] = useState([]);
  const productLinks = _.find(productsCategoryLinks, ['content.properties.category', category]);
  const groupName = _.get(data, 'type', '');
  const items = _.get(data, 'items.items', []);
  const isNA = lang === 'en-us';

  const handleMenuClick = () => {
    handleViewChange('menu');
    setCategory(null);
    setFiltered([]);
    setFilteredSeriesItems([]);
  };

  const handleFilterProducts = (_cat, _items) =>
    _.filter(_items, (val) => {
      const valCategory = _.get(val, 'properties.category', '');
      return _.isEqual(valCategory, _cat);
    });

  const handleProductClick = (cat) => {
    setCategory(cat);
    setFiltered(handleFilterProducts(cat, products));
  };

  const handleProductMenuClick = () => {
    if (!_.isEmpty(filtered)) {
      setFiltered([]);
      setFilteredSeriesItems([]);
    }
  };

  const groupBySeries = (val) => {
    const grouped = groupProductsByCategoryAndSubcategory(val);
    const sortedGrouped = grouped.sort((a, b) => {
      const seriesA = a.series.toLowerCase();
      const seriesB = b.series.toLowerCase();
      if (seriesA === 'john deere') {
        return 1;
      }
      if (seriesB === 'john deere') {
        return -1;
      }
      if (seriesA === 'iseki') {
        return 1;
      }
      if (seriesB === 'iseki') {
        return -1;
      }
      return seriesA.localeCompare(seriesB);
    });

    return sortedGrouped;
  };

  const getRangeLabel = (val) => {
    const { min, max, unit } = _.get(val, 'maxMinRangeKO', {});
    if (min) return `${min} - ${max} ${unit}`;
    if (max) return `${max} ${unit}`;
    return null;
  };

  const handleSeriesClick = (val) => {
    setFilteredSeriesItems(val);
  };

  useEffect(() => {
    if (isNA) handleProductClick('Tractors');
  }, []);

  const renderProductView = () => {
    if (!_.isEmpty(filtered)) return null;
    return (
      <div
        className="grid grid-cols-2 content-center items-center gap-10 xs:grid-cols-3
        md:grid-cols-4">
        {_.map(items, (item, index) => {
          const itemTitle = _.get(item, 'content.properties.title', '');
          const itemImage = _.get(item, 'content.properties.image[0]', null);
          const itemCategory = _.get(item, 'content.properties.category', '');
          return (
            <button
              type="button"
              key={index}
              className="flex flex-col gap-2"
              onClick={() => {
                console.log('item', item);
                handleProductClick(itemCategory)
              }}>
              {_.isEmpty(itemImage) || (
                <Image
                  src={itemImage.url}
                  alt={itemImage.name}
                  width={140}
                  height={163}
                  className="!w-full"
                  priority
                />
              )}
              <h3 className="font-noto text-[13px] capitalize leading-1.625 text-primary">
                {_.toLower(itemTitle)}
              </h3>
            </button>
          );
        })}
      </div>
    );
  };

  const renderItemListView = () => {
    const series = _.get(filteredSeriesItems, 'series', null);
    const subcategory = _.get(filteredSeriesItems, 'subCategory', '');
    let titleLabel = '';
    if (subcategory === 'Attachments')
      titleLabel = `${getTranslationByKey(subcategory, translations, lang)} - ${getTranslationByKey(series, translations, lang)}`;
    else {
      const range = getRangeLabel(filteredSeriesItems);
      titleLabel = series
        ? `${getTranslationByKey(series, translations, lang)} (${range})`
        : `${getTranslationByKey(category, translations, lang)} (${range})`;
    }

    if (_.isEmpty(filteredSeriesItems)) return null;
    return (
      <div className="custom-shadow-top-only flex h-full w-full flex-col items-start gap-10 px-7 py-5">
        <button
          type="button"
          className="h-fit font-noto text-[15px] font-bold tracking-widest text-cherry">
          {titleLabel}
        </button>
        <div className="grid w-full grid-cols-2 gap-x-10 gap-y-4 xs:grid-cols-3 md:grid-cols-4">
          {_.map(filteredSeriesItems.values, (val, index) => {
            const sideImage = _.get(val, 'properties.navigationThumbSideImage[0]', null);
            const featuredImage = _.get(val, 'properties.featuresImage[0]', {});
            const itemImage = sideImage || featuredImage;
            const itemTitle = _.get(val, 'properties.title', '');
            let itemPower = getPowerLabel(val, lang, category);
            if (lang === 'ko' || lang === 'en-ko') {
              itemPower = itemPower.toUpperCase();
            }
            const itemLabel = itemPower ? `${itemTitle} (${itemPower})` : itemTitle;
            resolveInternalLinks(val, lang);
            return (
              <Link href={val.route.path || '#'} key={index} className="flex items-center gap-3">
                {itemImage && (
                  <Image priority src={itemImage.url} alt={itemTitle} width={44} height={44} />
                )}
                <div className="flex flex-wrap gap-2">
                  <span className="whitespace-nowrap font-noto text-[12px]">{itemLabel}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSeriesLinksView = () => {
    const excluded = [
      'products/tractors/',
      'products/tractors/series-1/',
      'products/tractors/series-2/',
      'products/tractors/series-3/',
      'products/tractors/series-4/',
      'products/tractors/series-5/',
      'products/tractors/series-6/',
    ];
    const links = _.get(productLinks, 'content.properties.links', []);
    const secondaryLinks = _.get(productLinks, 'content.properties.secondaryLinks', []);
    const bottomLinks = _.get(productLinks, 'content.properties.bottomLinks', []);
    const allLinks = _.concat(links, secondaryLinks);
    _.forEach(allLinks, (link) => resolveInternalLinks(link, lang));
    _.forEach(bottomLinks, (link) => resolveInternalLinks(link, lang));

    const filteredLinks = _.filter(allLinks, (link) =>
      _.every(excluded, (ex) => !_.endsWith(link.url, ex)),
    );

    return (
      <>
        <div
          className={`col-span-3 grid grid-flow-row grid-cols-3 grid-rows-1 gap-3 gap-x-4 pb-3
  `}>
          {_.map(
            filteredLinks.filter(
              (link) =>
                link.title === 'Iseki - Import' ||
                link.title === 'ISEKI 트랙터' ||
                link.title === 'John Deere - Import' ||
                link.title === '존디어 트랙터',
            ),
            (link, index) => (
                <Link
                  href={link.url}
                  key={index}
                  className="flex h-fit w-full flex-col justify-between gap-1 font-noto text-[12px]">
                  {(link.title === 'Iseki - Import' || link.title === 'ISEKI 트랙터') && (
                    <Image
                      width={90}
                      height={60}
                      alt={link.title}
                      src="https://tym-new.euwest01.umbraco.io/media/n4pgf2wm/tjv755_tjv985_right-05x.png"
                      className="!relative object-cover"
                    />
                  )}
                  {(link.title === 'John Deere - Import' || link.title === '존디어 트랙터') && (
                    <Image
                      width={90}
                      height={60}
                      alt={link.title}
                      src="https://tym-new.euwest01.umbraco.io/media/ermbmsve/jd_6r_right-05x.png"
                      className="!relative object-cover"
                    />
                  )}
                  {link.title}
                  {(link.title === 'Iseki - Import' || link.title === 'ISEKI 트랙터') && (
                    <span className="font-noto text-[12px] leading-1.5">74.3 - 124 PS</span>
                  )}
                  {(link.title === 'John Deere - Import' || link.title === '존디어 트랙터') && (
                    <span className="font-noto text-[12px] leading-1.5">74.8 - 290 PS</span>
                  )}
                </Link>
              ),
          )}
          <div className="w-full" />
        </div>
        <div className="col-span-3 grid grid-flow-row grid-cols-2 grid-rows-1 gap-3 gap-x-10 pb-3">
          {_.map(
            filteredLinks.filter(
              (link) =>
                link.title !== 'Iseki - Import' &&
                link.title !== 'ISEKI 트랙터' &&
                link.title !== 'John Deere - Import' &&
                link.title !== '존디어 트랙터',
            ),
            (link, index) => (
                <Link
                  href={link.url}
                  key={index}
                  className="flex h-fit w-full flex-col justify-between gap-1 font-noto text-[12px]">
                  {link.title}
                </Link>
              ),
          )}
        </div>

        <div className="col-span-3 grid grid-cols-2 gap-10">
          {_.map(bottomLinks, (link, index) => (
            <Link
              href={link?.url || '#'}
              key={index}
              className="flex justify-center whitespace-pre border-none bg-cherry px-2.5 py-3
              text-[12px] font-bold uppercase leading-1.625 text-white hover:bg-paprika
              hover:text-white">
              {link.title}
            </Link>
          ))}
        </div>
      </>
    );
  };

  const renderSeriesView = () => {
    if (_.isEmpty(filtered)) return null;

    return (
      <div className="h-full w-full">
        <div className="custom-shadow-top-only w-full px-7">
          <button
            type="button"
            onClick={() => setFilteredSeriesItems([])}
            className="h-fit py-5 font-noto text-[15px] font-bold uppercase tracking-widest
            text-cherry">
            {getTranslationByKey(category, translations, lang)}
          </button>
          {_.isEmpty(filteredSeriesItems) && (
            <div className="grid w-full grid-cols-3 gap-4 pb-12">
              {_.map(groupBySeries(filtered), (val) => {
                const itemSeries = _.get(val, 'series', '');
                const itemSubCategory = _.get(val, 'subCategory', '');
                let itemRange = getRangeLabel(val);

                // Adjust itemRange based on the category and language
                if (category === 'Diesel Engines') {
                  if (lang === 'en') {
                    itemRange = itemRange.replace('PS', 'hp');
                  } else if (lang === 'ko' || lang === 'en-ko') {
                    itemRange = itemRange.replace('hp', 'PS');
                  }
                }

                const navigationThumbSideImage = _.get(
                  val,
                  'values[0].properties.navigationThumbSideImage[0]',
                  null,
                );
                const featuredImage = _.get(val, 'image', {});
                const image = navigationThumbSideImage || featuredImage;
                return (
                  <button
                    type="button"
                    className="flex w-full flex-col gap-2"
                    onClick={() => handleSeriesClick(val)}>
                    <Image
                      priority
                      src={image.url}
                      alt={itemSeries}
                      width={90}
                      height={60}
                      className="object-cover"
                    />
                    <div className="flex flex-col text-start">
                      <span className="font-noto text-[12px] leading-1.5">
                        {itemSeries || itemSubCategory
                          ? `${getTranslationByKey(itemSeries, translations, lang)}, ${getTranslationByKey(itemSubCategory, translations, lang)}`
                          : getTranslationByKey(category, translations, lang)}
                      </span>
                      <span className="test font-noto text-[12px] leading-1.5">{itemRange}</span>
                    </div>
                  </button>
                );
              })}
              {category === 'Tractors' && renderSeriesLinksView()}
            </div>
          )}
        </div>
        {renderItemListView()}
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-start overflow-y-auto">
      <button
        onClick={handleMenuClick}
        type="button"
        className="h-fit w-full px-7 py-5 text-left font-noto text-[15px] font-bold uppercase
        tracking-widest text-cherry">
        {getTranslationByKey('menu', translations, lang)}
      </button>

      {!isNA && (
        <div
          data-filtered={_.isEmpty(filtered)}
          className="custom-shadow-top-only flex h-fit w-full flex-col items-start gap-10 px-7 py-5
          data-[filtered=true]:h-full">
          <button
            onClick={handleProductMenuClick}
            type="button"
            className="h-fit font-noto text-[15px] font-bold uppercase tracking-widest text-cherry">
            {getTranslationByKey(groupName, translations, lang)}
          </button>
          {renderProductView()}
        </div>
      )}
      {renderSeriesView()}
    </div>
  );
}

export default HeaderMobileMenuProducts;

