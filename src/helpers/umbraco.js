import _ from 'lodash';
import resolveImageUrls from '@/helpers/resolve-image-urls';
import resolveInternalLinks from '@/helpers/resolve-internal-links';
import resolveExcludedBlocks from '@/helpers/resolve-excluded-blocks';
import resolveSettingsRegions from '@/helpers/resolve-settings-regions';
import resolveExcludedContentType from '@/helpers/resolve-excluded-content-type';

export async function getByContentType(
  contentType,
  region = null,
  locale = 'en-US',
  lang = undefined,
) {
  try {
    // console.log('lang', lang);
    const myHeaders = new Headers();
    const key = process.env.NEXT_PUBLIC_UMBRACO_API_KEY;
    myHeaders.append('Api-Key', key);
    myHeaders.append('Accept', '*');
    myHeaders.append('Accept-Language', locale);

    const options = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const baseUrl = process.env.NEXT_PUBLIC_UMBRACO_ENDPOINT;
    const baseImgUrl = process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL;

    const productQueryFields =
      `&fields=properties[id,name,route,properties[shortDescription,description,category,subCategory,series,subSeries,links,featuresImages,sliderFrontImage,highlightSpecificationThumbnail,navigationFrontImage,applicationTitle,applicationText,application,specifications,landsize,primaryApplication,taskIntensity,terrain,productTtile,productText,productLink,productImage,productDisclaimer,quizItems,comparedMachines,engineLogo,engineLogoNav,navigationThumbSideImage,configureParentProducts,productTag,product3DId,
      filterRopsCabin,filterPrimaryApplication,filterFunctionalOption,filterEngine,filterHP,filterGrains,filterFuelType,filterReapingRows,filterProductLine,filterEnginePower,filterDisplacementCc,filterIntakeSystem]]`;

    // Get the total count
    let url = `${baseUrl}?take=1&filter=contentType:${contentType}${contentType === 'product' ? productQueryFields : ''}`;
    let res = await fetch(url, options);
    let data = await res.json();

    // Adjust 'totalItems' based on the actual response structure
    const totalCount = _.get(data, 'total', 0);

    if (totalCount === 0) return [];

    // Fetch all items using the total count
    // eslint-disable-next-line max-len
    const productProperties =
      '&expand=properties[downloadables,comparedMachines[properties[downloadables],configureParentProducts[properties[title,featuresImage]],partsCatalog]';
    url = `${baseUrl}?take=${totalCount}&filter=contentType:${contentType}${contentType === 'product' ? productProperties : ''}`;
    res = await fetch(url, options);
    data = await res.json();
    let items = _.get(data, 'items', []);

    // Filter items based on excludedRegions and the provided region
    if (!_.isNil(region)) {
      items = _.filter(items, (item) => {
        const itemContentType = _.get(item, 'contentType', '');
        const isSettings = itemContentType === 'settings';
        if (isSettings) resolveSettingsRegions(item, region);

        const itemExcludedRegions = _.get(item, 'properties.excludedRegions', []);
        return !_.some(itemExcludedRegions, (val) => _.isEqual(val, region));
      });
    }

    resolveExcludedContentType(data, region);
    resolveImageUrls(items, baseImgUrl);
    resolveInternalLinks(items, lang);

    return items;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getByPath(path, region = null, lang = undefined) {
  try {
    // console.log('lang', lang);
    const myHeaders = new Headers();
    const key = process.env.NEXT_PUBLIC_UMBRACO_API_KEY;
    myHeaders.append('Api-Key', key);
    const options = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    const baseUrl = process.env.NEXT_PUBLIC_UMBRACO_ENDPOINT;
    const baseImgUrl = process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL;

    const url = `${baseUrl}/item/${path}`;
    const res = await fetch(url, options);
    const contentItem = await res.json();

    const pageExcludedRegions = _.get(contentItem, 'properties.excludedRegions', []);
    const shouldExcludePage = _.some(pageExcludedRegions, (val) => _.isEqual(val, region));

    if (shouldExcludePage) throw new Error('excluded page');
    if (_.isNull(region)) throw new Error('excluded page');

    resolveExcludedBlocks(contentItem, region);
    resolveImageUrls(contentItem, baseImgUrl);
    resolveInternalLinks(contentItem, lang);

    return contentItem;
  } catch (err) {
    console.error(err);
    return {};
  }
}

export async function getAllSlugs(contentType, locale) {
  try {
    // console.log('lang', lang);
    const myHeaders = new Headers();
    const key = process.env.NEXT_PUBLIC_UMBRACO_API_KEY;
    myHeaders.append('Api-Key', key);
    myHeaders.append('Accept', '*');
    myHeaders.append('Accept-Language', locale);

    const options = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const baseUrl = process.env.NEXT_PUBLIC_UMBRACO_ENDPOINT;

    // Get the total count
    let url = `${baseUrl}?take=1&fields=properties[id]&filter=contentType:${contentType}`;
    let res = await fetch(url, options);
    let data = await res.json();

    // Adjust 'totalItems' based on the actual response structure
    const totalCount = _.get(data, 'total', 0);

    if (totalCount === 0) return [];

    // Fetch all items using the total count
    url = `${baseUrl}?take=${totalCount}&fields=properties[id,name,route,excludedRegions]&filter=contentType:${contentType}`;
    // console.log(url);
    res = await fetch(url, options);
    data = await res.json();

    return _.get(data, 'items', []);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getAllByContentType(contentType, locale = 'en-US') {
  try {
    // console.log('lang', lang);
    const myHeaders = new Headers();
    const key = process.env.NEXT_PUBLIC_UMBRACO_API_KEY;
    myHeaders.append('Api-Key', key);
    myHeaders.append('Accept', '*');
    myHeaders.append('Accept-Language', locale);

    const options = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const baseUrl = process.env.NEXT_PUBLIC_UMBRACO_ENDPOINT;
    const baseImgUrl = process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL;

    const productQueryFields =
      '&fields=properties[id,name,route,properties[shortDescription,description,category,subCategory,series,subSeries,links,featuresImages,sliderFrontImage,highlightSpecificationThumbnail,navigationFrontImage,applicationTitle,applicationText,application,specifications,landsize,primaryApplication,taskIntensity,terrain,productTtile,productText,productLink,productImage,productDisclaimer,quizItems,comparedMachines,configureParentProducts,productTag, product3DId]]';

    // Get the total count
    let url = `${baseUrl}?take=1&sort=level:asc&filter=contentType:${contentType}${contentType === 'product' ? productQueryFields : ''}`;
    let res = await fetch(url, options);
    let data = await res.json();

    // Adjust 'totalItems' based on the actual response structure
    const totalCount = _.get(data, 'total', 0);

    if (totalCount === 0) return [];

    // Fetch all items using the total count
    // eslint-disable-next-line max-len
    url = `${baseUrl}?take=${totalCount}&sort=level:asc&filter=contentType:${contentType}`;
    // console.log(url);
    res = await fetch(url, options);
    data = await res.json();
    const items = _.get(data, 'items', []);

    resolveImageUrls(items, baseImgUrl);
    resolveInternalLinks(items);

    return items;
  } catch (err) {
    console.error(err);
    return [];
  }
}
