import _ from 'lodash';
import resolveExcludedContentType from '@/helpers/resolve-excluded-content-type';
import resolveImageUrls from '@/helpers/resolve-image-urls';
import resolveInternalLinks from '@/helpers/resolve-internal-links';

export const fetchPreOwnedPages = async (lang) => {
  try {
    const umbLocale = lang === 'ko' ? 'ko' : 'en-us';
    const myHeaders = new Headers();
    const key = process.env.NEXT_PUBLIC_UMBRACO_API_KEY;
    myHeaders.append('Api-Key', key);
    myHeaders.append('Accept', '*');
    myHeaders.append('Accept-Language', umbLocale);

    const options = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
      cache: 'force-cache',
    };

    const regions = {
      en: 'International',
      ko: '한국',
      'en-ko': 'South Korea',
      'en-us': 'North America',
    };
    const region = regions[lang];

    const baseImgUrl = process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL;
    const baseUmbracoUrl = process.env.NEXT_PUBLIC_UMBRACO_ENDPOINT;

    // Construct the URL to fetch all items of content type "preOwned"
    // Sorting ascending by sortOrder and fetching fields you need
    const baseUrl = `${baseUmbracoUrl}?sort=sortOrder:asc`;
    const suffixUrl = `&fields=properties[links,category,report,certified,warranty,hours,years,featuresImage,title,name,subCategory,highlightSpecificationThumbnail,series,subSeries,hideFromListing,sliderFrontImage,featuresImage,specifications,navigationThumbSideImage,engineLogoNav,requestQuote,excludedRegions,navigationSideImage,sortIndex,product3DId,navigationFrontImage,configureParentProducts,productTag]`;

    // Add filter by content type alias "preOwned"
    // Also filter by language and take up to 100 records per request if needed
    const url = `${baseUrl}&filter=contentType:preOwned&take=100&lang=${lang}${suffixUrl}`;

    const response = await fetch(url, options);
    const json = await response.json();

    let items = _.get(json, 'items', []);

    if (region) {
      items = _.filter(items, (item) => {
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
};
