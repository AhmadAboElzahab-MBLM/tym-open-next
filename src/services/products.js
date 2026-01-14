import _ from 'lodash';
import resolveExcludedContentType from '@/helpers/resolve-excluded-content-type';
import resolveImageUrls from '@/helpers/resolve-image-urls';
import resolveInternalLinks from '@/helpers/resolve-internal-links';

const seriesUrls = [
  '/products/tractors/series-1',
  '/products/tractors/series-2',
  '/products/tractors/series-3',
  '/products/tractors/series-4',
  '/products/tractors/series-5',
  '/products/tractors/series-6',
  '/products/tractors/iseki',
  '/products/tractors/john-deere',
  '/products/tractors/john-deere/john-deere-r-series',
  '/products/tractors/john-deere/john-deere-m-series',
  '/products/combine-harvesters',
  '/products/rice-transplanters',
  '/products/engines',
  '/products/attachments/front-end-loader',
  '/products/attachments/mid-mount-mower',
  '/products/attachments/backhoe',
];

export const fetchNavigationProducts = async (lang) => {
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
    const baseUrl = `${process.env.NEXT_PUBLIC_UMBRACO_ENDPOINT}?sort=sortOrder:asc`;

    const sufixUrl =
      '&fields=properties[category,title,name,subCategory,series,subSeries,links,' +
      'navigationSideImage,specifications,featuresImage,excludedRegions,engineLogoNav,' +
      'navigationThumbSideImage,requestQuote,navigationFrontImage,highlightSpecificationThumbnail,' +
      'shortDescription,product3DId,sliderFrontImage,productText,description,hideFromListing,productTag,' +
      'configureParentProducts,sAMProduct,johnDeere,daveProduct,yearsPartnership,compatibleProduct,landsize,primary_application,' +
      'task_intensity,terrain,productTitle,productLink,productImage,productDisclaimer,quizItems,' +
      'textWithTwoImagesItems,comparedMachines,technicalSpecificationParent,specificationTitle,' +
      'filterRopsCabin,filterPrimaryApplication,filterFunctionalOption,filterEngine,filterHP,filterGrains,filterFuelType,filterReapingRows,filterProductLine,filterEnginePower,filterDisplacementCc,filterIntakeSystem,' +
      'downloadables,technicalBrochure,seriesOrder,sortIndex,isParent,application,productCategory]' +
      '&expand=properties[downloadables,comparedMachines=[properties[$all]]]';

    const data = seriesUrls.map((url) => {
      const fullUrl = `${baseUrl}&take=100&fetch=children:${lang}${url}${sufixUrl}`;
      return fetch(fullUrl, options);
    });

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

    // console.log(items);
    return items;
  } catch (err) {
    console.error(err);
    return [];
  }
};
