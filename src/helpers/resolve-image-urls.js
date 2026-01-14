import _ from 'lodash';

export default function resolveImageUrls(obj, urlPrefix) {
  const imageTypes = [
    'downloadables',
    'partsCatalog',
    'featuredImage',
    'featuresImage',
    'heroImages',
    'highlightSpecificationThumbnail',
    'icon',
    'image',
    'images',
    'modalImage',
    'productImage',
    'productLink',
    'threeSixtyImages',
    'uspImages',
    'firstImage',
    'secondImage',
    'detailsSingleImage',
    'engineLogo',
    'engineLogoNav',
    'sliderFrontImage',
    'navigationFrontImage',
    'navigationSideImage',
    'mobileImage',
    'mobileBanner',
    'navigationThumbSideImage',
    'bannerVideo',
    'videoMedia',
    'rotateViewImages',
    'innerPageFeaturedImage',
    'attachmentsSingleImage'
  ];
  _.forEach(obj, (value, key) => {
    const hasImageType = imageTypes.some((val) => _.isEqual(val, key));
    if (hasImageType && _.isArray(value)) {
      _.forEach(value, (image, index) => {
        if (image.url) {
          _.set(obj, `[${key}][${index}].url`, urlPrefix + image.url);
        }
      });
    } else if (_.isObject(value) || _.isArray(value)) {
      resolveImageUrls(value, urlPrefix);
    }
  });
}
