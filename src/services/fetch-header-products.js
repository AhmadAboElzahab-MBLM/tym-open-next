import _ from 'lodash';
import resolveExcludedContentType from '@/helpers/resolve-excluded-content-type';
import resolveImageUrls from '@/helpers/resolve-image-urls';
import resolveInternalLinks from '@/helpers/resolve-internal-links';

const seriesUrls = [
  '/products/tractors/series-1',
  '/products/tractors/series-1/2500',
  '/products/tractors/series-1/2400',
  '/products/tractors/series-1/2500l',
  '/products/tractors/series-2',
  '/products/tractors/series-3',
  '/products/tractors/series-4',
  '/products/tractors/series-5',
  '/products/tractors/series-6',
  '/products/combine-harvesters',
  '/products/rice-transplanters',
  '/products/engines',
  '/products/attachments/front-end-loader',
  '/products/attachments/mid-mount-mower',
  '/products/attachments/backhoe',
];

export const fetchHeaderProducts = async (lang) => {
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
    const baseUrl = `${baseUmbracoUrl}?sort=sortOrder:asc`;
    const sufixUrl = `&fields=properties[links,category,title,name,subCategory,series,subSeries,hideFromListing,sliderFrontImage,featuresImage,specifications,navigationThumbSideImage,engineLogoNav,requestQuote,excludedRegions,navigationSideImage,sortIndex,product3DId,navigationFrontImage,configureParentProducts,productTag]`;

    const data = seriesUrls.map((url) => 
      fetch(`${baseUrl}&take=100&fetch=children:${lang}${url}${sufixUrl}`, options)
    );

    const responses = await Promise.all(data);
    const json = await Promise.all(responses.map((res) => res.json()));

    let items = _.chain(json)
      .map((val) => val.items)
      .flatten()
      .value();

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
