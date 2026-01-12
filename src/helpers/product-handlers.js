import _, { get, toLower } from 'lodash';

export function sortByTitle(values) {
  if (_.isArray(values)) {
    values.sort((valueA, valueB) => {
      const titleA = _.get(valueA, 'properties.title', '');
      const titleB = _.get(valueB, 'properties.title', '');
      return titleA?.localeCompare(titleB);
    });
  }
}

export function sortByJohnDeereLast(values) {
  if (_.isArray(values)) {
    values.sort((valueA, valueB) => {
      const seriesA = toLower(get(valueA, 'properties.series', ''));
      const seriesB = toLower(get(valueB, 'properties.series', ''));
      if (seriesA === 'john deere') return 1;
      if (seriesB === 'john deere') return -1;
      return 0;
    });
  }
}

export function sortByIsekiLast(values) {
  if (_.isArray(values)) {
    values.sort((valueA, valueB) => {
      const seriesA = toLower(get(valueA, 'properties.series', ''));
      const seriesB = toLower(get(valueB, 'properties.series', ''));
      if (seriesA === 'iseki') return 1;
      if (seriesB === 'iseki') return -1;
      return 0;
    });
  }
}

export function sortBySeriesOrder(values) {
  if (_.isArray(values)) {
    values.sort((valueA, valueB) => {
      const orderA = _.get(valueA, 'properties.seriesOrder', 0);
      const orderB = _.get(valueB, 'properties.seriesOrder', 0);

      if (!_.isEqual(orderA, orderB)) return orderA - orderB;
      return _.isEqual(orderA, orderB) ? 0 : orderA - orderB;
    });
  }
}

export function sortBySortIndex(values) {
  if (_.isArray(values)) {
    values.sort((valueA, valueB) => {
      const orderA = Number(_.get(valueA, 'properties.sortIndex', 0));
      const orderB = Number(_.get(valueB, 'properties.sortIndex', 0));

      if (!_.isEqual(orderA, orderB)) return orderA - orderB;
      return _.isEqual(orderA, orderB) ? 0 : orderA - orderB;
    });
  }
}

export function sortByEnginePower(values) {
  if (_.isArray(values)) {
    values.sort((valueA, valueB) => {
      const specificationsA = _.get(valueA, 'properties.specifications.items', []);
      const enginePowerA = _.find(
        specificationsA,
        (spec) => _.get(spec, 'content.properties.title') === 'Engine power',
      );
      const specificationsB = _.get(valueB, 'properties.specifications.items', []);
      const enginePowerB = _.find(
        specificationsB,
        (spec) => _.get(spec, 'content.properties.title') === 'Engine power',
      );
      const powerAUS = _.get(enginePowerA, 'content.properties.valueUS', 0);
      const powerBUS = _.get(enginePowerB, 'content.properties.valueUS', 0);
      const powerAMetric = _.get(enginePowerA, 'content.properties.valueMetric', 0);
      const powerBMetric = _.get(enginePowerB, 'content.properties.valueMetric', 0);

      const diff1 = Number(powerAUS) - Number(powerBUS);
      const diff2 = Number(powerAMetric) - Number(powerBMetric);

      if (diff1 !== 0) return diff1;
      if (diff2 !== 0) return diff2;

      return 0;
    });
  }
}

export function sortByEnginePowerByLang(values, lang) {
  if (_.isArray(values)) {
    values.sort((valueA, valueB) => {
      const specificationsA = _.get(valueA, 'properties.specifications.items', []);
      const enginePowerA = _.find(
        specificationsA,
        (spec) => _.get(spec, 'content.properties.title') === 'Engine power',
      );
      const specificationsB = _.get(valueB, 'properties.specifications.items', []);
      const enginePowerB = _.find(
        specificationsB,
        (spec) => _.get(spec, 'content.properties.title') === 'Engine power',
      );

      // Determine which power value to use based on language
      let powerA;
      let powerB;
      
      if (lang === 'ko' || lang === 'en-ko') {
        // Use metric values for Korean language
        powerA = Number(_.get(enginePowerA, 'content.properties.valueMetric', 0));
        powerB = Number(_.get(enginePowerB, 'content.properties.valueMetric', 0));
      } else {
        // Use US values for English language
        powerA = Number(_.get(enginePowerA, 'content.properties.valueUS', 0));
        powerB = Number(_.get(enginePowerB, 'content.properties.valueUS', 0));
      }

      // Sort in ascending order (lowest to highest power)
      return powerA - powerB;
    });
  }
}

function generateGroupKey(product) {
  const { category, subCategory, series } = _.get(product, 'properties', {});
  const categoryPlaceholder = _.snakeCase(_.defaultTo(category, 'no_category'));
  const subCategoryPlaceholder = _.snakeCase(_.defaultTo(subCategory, 'no_subcategory'));
  const seriesPlaceholder = _.snakeCase(_.defaultTo(series, 'no_series'));

  return `${categoryPlaceholder}/${subCategoryPlaceholder}/${seriesPlaceholder}`;
}

function groupByCategorySubcategorySeries(products) {
  return _.groupBy(products, generateGroupKey);
}

function calculateRangeBySpec(values, specTitle, isKO = null) {
  const all = [];
  let unit = null;
  let max = null;
  let min = null;

  _.forEach(values, (value) => {
    const specifications = _.get(value, 'properties.specifications.items', []);
    _.forEach(specifications, (spec) => {
      const title = _.get(spec, 'content.properties.title');
      const valueUS = _.get(spec, 'content.properties.valueUS');
      const valueMetric = _.get(spec, 'content.properties.valueMetric');
      const unitUS = _.get(spec, 'content.properties.unitUS');
      const unitMetric = _.get(spec, 'content.properties.unitMetric');

      if (title === specTitle) {
        unit = isKO ? unitMetric : unitUS;
        unit = unit === 'ps' ? 'PS' : unit;
        all.push(isKO ? valueMetric : valueUS);
      }
    });
  });

  if (all.length > 1) {
    max = Math.max(...all);
    min = Math.min(...all);

    if (max === min) return `${max} ${unit}`;
    return `${min} - ${max} ${unit}`;
  }

  if (all.length === 1) {
    max = _.head(all);
    return `${max} ${unit}`;
  }

  return '';
}

function calculateMaxMinRows(values, isKO = null) {
  const all = [];
  let unit = null;
  let max = null;
  let min = null;

  _.forEach(values, (value) => {
    const specifications = _.get(value, 'properties.specifications.items', []);
    _.forEach(specifications, (spec) => {
      const title = _.get(spec, 'content.properties.title');
      const valueUS = _.get(spec, 'content.properties.valueUS');
      const valueMetric = _.get(spec, 'content.properties.valueMetric');
      const unitUS = _.get(spec, 'content.properties.unitUS');
      const unitMetric = _.get(spec, 'content.properties.unitMetric');

      if (title === 'Engine power') {
        unit = isKO ? unitMetric : unitUS;
        unit = unit === 'ps' ? 'PS' : unit;
        all.push(isKO ? valueMetric : valueUS);
      }
    });
  });

  if (all.length > 1) {
    max = Number(Math.max(...all));
    min = Number(Math.min(...all));
    return { max, min, unit };
  }

  if (all.length === 1) {
    max = Number(_.head(all));
    return { max, unit };
  }

  return {};
}

function calculateMaxMinRange(values, isKO = null) {
  const all = [];
  let unit = null;
  let max = null;
  let min = null;

  _.forEach(values, (value) => {
    const specifications = _.get(value, 'properties.specifications.items', []);
    _.forEach(specifications, (spec) => {
      const title = _.get(spec, 'content.properties.title');
      const valueUS = _.get(spec, 'content.properties.valueUS');
      const valueMetric = _.get(spec, 'content.properties.valueMetric');
      const unitUS = _.get(spec, 'content.properties.unitUS');
      const unitMetric = _.get(spec, 'content.properties.unitMetric');

      if (title === 'Engine power') {
        unit = isKO ? unitMetric : unitUS;
        unit = unit === 'ps' ? 'PS' : unit;
        all.push(isKO ? valueMetric : valueUS);
      }
    });
  });

  if (all.length > 1) {
    max = Number(Math.max(...all));
    min = Number(Math.min(...all));
    return { max, min, unit };
  }

  if (all.length === 1) {
    max = Number(_.head(all));
    return { max, unit };
  }

  return {};
}

function enrichGroupedProducts(_groupedProducts) {
  return _.map(_groupedProducts, (values, key) => {
    const firstValue = _.get(values, '[0]', {});
    const description = _.get(firstValue, 'properties.description', '');
    const shortDescription = _.get(firstValue, 'properties.shortDescription', '');
    const product3DId = _.get(firstValue, 'properties.product3DId', '');
    const image = _.defaultTo(_.get(firstValue, 'properties.featuresImage[0]'), null);
    const sliderFrontImage = _.defaultTo(_.get(firstValue, 'properties.sliderFrontImage[0]'), null);
    const range = calculateRangeBySpec(values, 'Engine power');
    const rangeKO = calculateRangeBySpec(values, 'Engine power', true);
    const series = _.get(firstValue, 'properties.series', '');
    const category = _.get(firstValue, 'properties.category', '');
    const subCategory = _.get(firstValue, 'properties.subCategory', '');
    const productTag = _.get(firstValue, 'properties.productTag', '');
    const maxMinRange = calculateMaxMinRange(values);
    const maxMinRangeKO = calculateMaxMinRange(values, true);
    const hitchLiftCapacity = calculateRangeBySpec(values, 'Hitch lift capacity');
    const hitchLiftCapacityKO = calculateRangeBySpec(values, 'Hitch lift capacity', true);
    const hideFromListing = _.every(
      values,
      (value) => _.get(value, 'properties.hideFromListing', false) === true,
    );

    // values.sort((valueA, valueB) => {
    //   // sort by title
    //   const titleA = _.get(valueA, 'properties.title', '');
    //   const titleB = _.get(valueB, 'properties.title', '');
    //   if (titleA < titleB) return -1;
    //   if (titleA > titleB) return 1;
    //   return 0;
    // });

    // sortByEnginePower(values);

    return {
      key,
      values,
      shortDescription,
      description,
      product3DId,
      image,
      sliderFrontImage,
      range,
      rangeKO,
      series,
      category,
      subCategory,
      maxMinRange,
      maxMinRangeKO,
      hideFromListing,
      hitchLiftCapacity,
      hitchLiftCapacityKO,
      productTag
    };
  });
}

function safeSplit(string, separator) {
  return _.isString(string) ? string.split(separator) : [];
}

function sortGroupedProducts(_groupedProducts) {
  return _.sortBy(_groupedProducts, [
    (item) => _.head(safeSplit(item.key, '/')),
    (item) => _.nth(safeSplit(item.key, '/'), 2),
  ]);
}

function filterByCategory(_groupedProducts, categoryFilter) {
  // console.log(_groupedProducts);
  return _groupedProducts.filter((item) => _.startsWith(item.key, `${categoryFilter}/`));
}

export function groupProductsByCategoryAndSubcategory(products, categoryFilter) {
  const groupedProducts = groupByCategorySubcategorySeries(products);
  const enrichedGroupedProducts = enrichGroupedProducts(groupedProducts);

  const sortedArray = sortGroupedProducts(enrichedGroupedProducts);
  return categoryFilter ? filterByCategory(sortedArray, categoryFilter) : sortedArray;
}

function capitalizeWordsPreserveDash(str) {
  return str.split(' ').map(word =>
    word.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
  ).join(' ');
}

export function formatKeyToLabel(key, returnSeries = false) {
  const parts = safeSplit(key, '/').map(capitalizeWordsPreserveDash).reverse();
  const filteredParts = parts.filter((part) => !part.startsWith('No'));

  if (filteredParts.length >= 2) {
    return returnSeries
      ? filteredParts[0]
      : `${filteredParts[0]}, ${filteredParts}`;
  }
  if (filteredParts.length === 1) return filteredParts[0];
  if (returnSeries) return 'No Series';
  return 'No Category';
}

export function getProductPower(val, lang, category, isKO) {
  let unit = '';
  let power = '';
  let powerLabel = '';
  const specs = _.get(val, 'properties.specifications.items', []);

  specs.forEach((spec) => {
    const title = _.get(spec, 'content.properties.title');
    const valueMetric = _.get(spec, 'content.properties.valueMetric');
    const unitMetric = _.get(spec, 'content.properties.unitMetric');

    if (category === 'Diesel Engines' && title === 'Engine power') {
      if (lang === 'en') {
        powerLabel = `(${valueMetric} hp)`;
      } else {
        powerLabel = `(${valueMetric} PS)`;
      }
    } else if (title === 'Engine power') {
      if (title === 'Engine power') {
        power = isKO ? valueMetric : valueMetric;
        unit = isKO ? unitMetric : unitMetric;
        unit = unit === 'ps' ? 'PS' : unit;
      }
    }
  });
  if (unit && power) return `(${power} ${unit})`;

  return powerLabel;
}
