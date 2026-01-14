import _ from 'lodash';
import resolveImageUrls from '@/helpers/resolve-image-urls';
import resolveInternalLinks from '@/helpers/resolve-internal-links';
import resolveExcludedBlocks from '@/helpers/resolve-excluded-blocks';
import resolveSettingsRegions from '@/helpers/resolve-settings-regions';
import resolveExcludedContentType from '@/helpers/resolve-excluded-content-type';

export async function getByContentTypeSpecificData(
  contentType,
  region = null,
  locale = 'en-US',
  lang = undefined,
) {
  try {
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

    // Get the total count
    let url = `${baseUrl}?take=1&filter=contentType:${contentType}&fields=properties[id]`;
    let res = await fetch(url, options);
    let data = await res.json();

    // console.log(url);

    // Adjust 'totalItems' based on the actual response structure
    const totalCount = _.get(data, 'total', 0);

    if (totalCount === 0) return [];

    // Fetch all items using the total count
    const sort = '&sort=sortOrder:asc';
    const filter = `&filter=contentType:${contentType}`;
    const howToFields =
      '&fields=properties[date,description,excludedRegions,featuredImage,series,subtitle,title,tractorModel,type]';
    const mediaItemFields =
      '&fields=properties[date,description,excludedRegions,featured,featuredImage,productType,title,type]';
    const promotionFields =
      '&fields=properties[featuredImage,title,subtitle,title,description,relatedTo,promotionLink,excludedRegions,pageContent]';
    const preOwnedFields =
      '&fields=properties[links,category,report,certified,sold,warranty,hours,years,featuresImage,title,name,subCategory,highlightSpecificationThumbnail,series,subSeries,hideFromListing,sliderFrontImage,specifications,navigationThumbSideImage,engineLogoNav,requestQuote,excludedRegions,navigationSideImage,sortIndex,product3DId,navigationFrontImage,configureParentProducts,productTag]';

    if (contentType === 'mediaItem') {
      url = `${baseUrl}?take=${totalCount}${sort}${filter}${mediaItemFields}`;
    } else if (contentType === 'promotion') {
      url = `${baseUrl}?take=${totalCount}${sort}${filter}${promotionFields}`;
    } else if (contentType === 'howTo') {
      url = `${baseUrl}?take=${totalCount}${sort}${filter}${howToFields}`;
    } else if (contentType === 'preOwned') {
      url = `${baseUrl}?take=${totalCount}${sort}${filter}${preOwnedFields}`;
    } else {
      url = `${baseUrl}?take=${totalCount}${sort}${filter}`;
    }

    res = await fetch(url, options);
    data = await res.json();
    let items = _.get(data, 'items', []);

    if (region) {
      items = _.filter(items, (item) => {
        const itemContentType = _.get(item, 'contentType', '');
        const isSettings = itemContentType === 'settings';
        if (isSettings) resolveSettingsRegions(item, region);

        const itemExcludedRegions = _.get(item, 'properties.excludedRegions', []);
        return !_.some(itemExcludedRegions, (val) => _.isEqual(val, region));
      });
    }

    resolveExcludedContentType(items, region);
    resolveImageUrls(items, baseImgUrl);
    resolveInternalLinks(items, lang);

    return items;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getByContentType(
  contentType,
  region = null,
  locale = 'en-US',
  lang = undefined,
) {
  try {
    const myHeaders = new Headers();
    const key = process.env.NEXT_PUBLIC_UMBRACO_API_KEY;
    myHeaders.append('Api-Key', key);
    myHeaders.append('Accept', '*');
    myHeaders.append('Accept-Language', locale);

    const options = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
      cache: 'force-cache',
    };

    const baseUrl = process.env.NEXT_PUBLIC_UMBRACO_ENDPOINT;
    const baseImgUrl = process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL;

    let url = `${baseUrl}?take=1&filter=contentType:${contentType}&fields=properties[id]`;
    let res = await fetch(url, options);
    let data = await res.json();

    // Adjust 'totalItems' based on the actual response structure
    const totalCount = _.get(data, 'total', 0);

    if (totalCount === 0) return [];

    // Fetch all items using the total count
    // eslint-disable-next-line max-len

    const productQueryFields = `&fields=properties[id,name,route,title,excludedRegions,shortDescription,description,category,subCategory,series,subSeries,links,featuresImage,sliderFrontImage,highlightSpecificationThumbnail,navigationFrontImage,applicationTitle,applicationText,application,specifications,landsize,primaryApplication,taskIntensity,terrain,productTitle,productText,productLink,productImage,productDisclaimer,quizItems,comparedMachines,engineLogo,engineLogoNav,navigationThumbSideImage,configureParentTractors,seriesOrder,isParent,product3DId,
      filterRopsCabin,filterPrimaryApplication,filterFunctionalOption,filterEngine,filterHP,filterGrains,filterFuelType,filterReapingRows,filterProductLine,filterEnginePower,filterDisplacementCc,filterIntakeSystem]`;

    const sort = '&sort=sortOrder:asc';

    const filter = `&filter=contentType:${
      contentType === 'product' ? contentType + productQueryFields : contentType
    }`;

    url = `${baseUrl}?take=${totalCount}${sort}${filter}`;
    res = await fetch(url, options);
    data = await res.json();
    let items = _.get(data, 'items', []);

    // Filter items based on excludedRegions and the provided region
    if (region) {
      items = _.filter(items, (item) => {
        const itemContentType = _.get(item, 'contentType', '');
        const isSettings = itemContentType === 'settings';
        if (isSettings) resolveSettingsRegions(item, region);

        const itemExcludedRegions = _.get(item, 'properties.excludedRegions', []);
        return !_.some(itemExcludedRegions, (val) => _.isEqual(val, region));
      });
    }

    resolveImageUrls(items, baseImgUrl);
    resolveInternalLinks(items, lang);

    return items;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getByPath(path, region = null) {
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

    const url = `${baseUrl}/item/${path}?expand=properties[comparedMachines[$all],downloadables[$all],body[properties[items[properties[productItems[properties[$all]]]],productItems[properties[productItems[properties[$all]]]]]]]`;
    // console.log(url);
    const res = await fetch(url, options);
    const contentItem = await res.json();

    const pageExcludedRegions = _.get(contentItem, 'properties.excludedRegions', []);
    const shouldExcludePage = _.some(pageExcludedRegions, (val) => _.isEqual(val, region));

    if (shouldExcludePage) throw new Error('excluded page');
    if (_.isNull(region)) throw new Error('excluded page');

    resolveExcludedBlocks(contentItem, region);
    resolveImageUrls(contentItem, baseImgUrl);
    resolveInternalLinks(contentItem);

    return contentItem;
  } catch (err) {
    console.error(err);
    return {};
  }
}

export async function getAllSlugs(contentType, locale) {
  try {
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
    res = await fetch(url, options);
    data = await res.json();

    return _.get(data, 'items', []);
  } catch (err) {
    console.error(err);
    return [];
  }
}
