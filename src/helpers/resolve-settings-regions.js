import _ from 'lodash';

export default function resolveSettingsRegions(_item, _region) {
  const mainNavigation = _.get(_item, 'properties.mainNavigation.items', []);
  const fMainNavigation = _.filter(mainNavigation, (val) => {
    const excludedRegions = _.get(val, 'content.properties.excludedRegions', []);
    return !_.includes(excludedRegions, _region);
  });

  const applicationsNavigation = _.get(_item, 'properties.applicationsNavigation.items', []);
  const fApplicationsNavigation = _.filter(applicationsNavigation, (val) => {
    const excludedRegions = _.get(val, 'content.properties.excludedRegions', []);
    return !_.includes(excludedRegions, _region);
  });

  const productsNavigation = _.get(_item, 'properties.productsNavigation.items', []);
  const fProductsNavigation = _.filter(productsNavigation, (val) => {
    const excludedRegions = _.get(val, 'content.properties.excludedRegions', []);
    return !_.includes(excludedRegions, _region);
  });

  const footerNavigation = _.get(_item, 'properties.footerNavigation.items', []);
  const fFooterNavigation = _.filter(footerNavigation, (val) => {
    const excludedRegions = _.get(val, 'content.properties.excludedRegions', []);
    return !_.includes(excludedRegions, _region);
  });

  const productCategoryLinks = _.get(_item, 'properties.productsCategoryLinks.items', []);
  const fProductCategoryLinks = _.filter(productCategoryLinks, (val) => {
    const excludedRegions = _.get(val, 'content.properties.excludedRegions', []);
    return !_.includes(excludedRegions, _region);
  });

  _.set(_item, 'properties.mainNavigation.items', fMainNavigation);
  _.set(_item, 'properties.applicationsNavigation.items', fApplicationsNavigation);
  _.set(_item, 'properties.productsNavigation.items', fProductsNavigation);
  _.set(_item, 'properties.footerNavigation.items', fFooterNavigation);
  _.set(_item, 'properties.productsCategoryLinks.items', fProductCategoryLinks);
}
