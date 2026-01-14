import { get, isEqual, map } from 'lodash';
import { getByContentTypeSpecificData } from '@/services/umbraco';
import { fetchNavigationProducts } from '@/services/products';
import { sortByEnginePower, sortByTitle } from '@/helpers/product-handlers';

const hasContentTypeBlock = (data, contentType) => {
  const blocks = get(data, 'properties.body.items', []);
  return blocks.some((block) => get(block, 'content.contentType') === contentType);
};

const handleMapContentCheck = (arr, data) => map(arr, (val) => hasContentTypeBlock(data, val));

export default async function handleSpecificData(data, region, locale, lang) {
  const contentType = get(data, 'contentType', '');
  const isProductPage =
    isEqual(contentType, 'product') ||
    isEqual(contentType, 'page') ||
    isEqual(contentType, 'preOwned');

  let product = null;
  const productsBlocks = [
    'applicationTractorsList',
    'attachmentsPaginated',
    'availableDownloads',
    'availablePartsCatalogsDownloads',
    'homeTractorSlider',
    'innerPageTractorsSlider',
    'otherProductsPaginated',
    'productsPaginated',
    'requestPart',
    'requestQuote',
    'samProductBlock',
    'johnDeereProductBlock',
    'daveProductBlock',
    'seriesTractorsList',
    'technicalSpecification',
    'threeProductSlider',
    'promotionsProducts',
  ];
  const productsArr = handleMapContentCheck(productsBlocks, data);
  
  // Fetch products when needed (dynamic rendering)
  if (productsArr.some(Boolean) || isProductPage) {
    product = await fetchNavigationProducts(lang);
    sortByTitle(product);
    sortByEnginePower(product);
  }

  let customerStory = null;
  const customerStoryBlocks = ['successStoriesSlider', 'successStoriesPaginated'];
  const customerStoryArr = handleMapContentCheck(customerStoryBlocks, data);
  if (customerStoryArr.some(Boolean) || isProductPage)
    customerStory = await getByContentTypeSpecificData('customerStory', region, locale, lang);

  let promotion = null;
  const promotionBlocks = ['promotionsSlider'];
  const promotionArr = handleMapContentCheck(promotionBlocks, data);
  if (promotionArr.some(Boolean) || isProductPage)
    promotion = await getByContentTypeSpecificData('promotion', region, locale, lang);

  let mediaItem = null;
  const mediaItemBlocks = ['latestNews'];
  const mediaItemArr = handleMapContentCheck(mediaItemBlocks, data);
  if (mediaItemArr.some(Boolean) || isProductPage)
    mediaItem = await getByContentTypeSpecificData('mediaItem', region, locale, lang);

  let howTo = null;
  const howToBlocks = ['howTosChecklist'];
  const howToArr = handleMapContentCheck(howToBlocks, data);
  if (howToArr.some(Boolean))
    howTo = await getByContentTypeSpecificData('howTo', region, locale, lang);

  return {
    product,
    customerStory,
    promotion,
    mediaItem,
    howTo,
  };
}
