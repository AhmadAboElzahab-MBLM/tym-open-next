import React, { useContext, useState } from 'react';
import _, { get, isEmpty, map } from 'lodash';
import Image from 'next/image';
import { getTranslationByKey } from '@/utils/translation-helper';
import Link from 'next/link';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import GlobalContext from '@/context/global-context';
import { getProductPower } from '@/helpers/product-handlers';
import Icons from '@/components/layout/icons';
import { getProductBuildYourOwnLink } from '@/helpers/product-links';

function Modal({ closeModal, parent, configure, url }) {
  const { lang } = useContext(GlobalContext);
  const title = get(parent, 'properties.title', '');
  const children = get(parent, 'properties.configureParentProducts', []);

  return (
    <div
      className="fixed top-0 z-[999] flex h-screen w-full items-center justify-center bg-[#E5E5E5]
      bg-opacity-50">
      <div
        className="h-fit max-h-[90vh] max-w-[90vw] border-grey bg-white md:min-h-[526px] md:w-auto
        md:min-w-[596px]">
        <div
          className="flex flex-row justify-between gap-2 border-b border-b-grey p-5 pb-5 md:p-12
          md:pb-10">
          <h4 className="font-noto text-[12px] font-bold uppercase tracking-wider md:text-[15px]">
            {`${title} tractor model variations:`}
          </h4>
          <button type="button" onClick={closeModal} className="close-button">
            <Icons name="Close" />
          </button>
        </div>

        <div className="flex flex-col gap-8 p-5 md:flex-row md:p-12">
          {map(children, (item, index) => {
            const featuredImage = get(parent, 'properties.featuresImage[0]', {});
            const itemTitle = get(item, 'name', '');
            const modelId = get(item, 'properties.product3DId', '');
            const itemDescription = get(parent, 'properties.shortDescription', '');
            const itemUrl = url
              ? `${url}${itemTitle}`
              : getProductBuildYourOwnLink(lang, itemTitle, modelId, configure);

            return (
              <Link
                href={itemUrl}
                key={index}
                target={url ? '' : '_blank'}
                className="header-children-modal-popup flex w-full max-w-[256px] flex-col gap-y-2 md:gap-y-5">
                {isEmpty(featuredImage) || (
                  <div className="w-full">
                    <Image
                      src={featuredImage.url}
                      alt={featuredImage.name}
                      fill
                      className="!relative mx-auto !h-auto max-h-[260px] !w-auto
                      object-cover md:max-h-[243px]"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-y-[5px] md:gap-y-[10px]">
                  <h3
                    className="font-noto text-[18px] font-bold leading-[24px] text-primary
                    md:text-[21px]">
                    {itemTitle}
                  </h3>
                  <p className="font-noto text-[13px] font-normal text-primary md:text-[15px]">
                    {itemDescription}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HeaderDesktopProductsMenuInnerCard({ item, category, hasLabel }) {
  const { translations, lang } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configure, setConfigure] = useState(false);
  const childrenProducts = _.get(item, 'properties.configureParentProducts');
  const [url, setUrl] = useState(false);
  const navImage = _.get(item, 'properties.navigationFrontImage[0]', null);
  const image =
    category === 'Harvesters'
      ? _.get(item, 'properties.navigationFrontImage[0]', null) || navImage
      : navImage || _.get(item, 'properties.featuresImage[0]', null);
  const engineLogoNav = _.get(item, 'properties.engineLogoNav[0]', null);
  const name = _.get(item, 'properties.title', '');
  const modelName = _.get(item, 'name', '');
  const modelId = _.get(item, 'properties.product3DId', '');
  const path = _.get(item, 'route.path', '#');
  const requestQuote = _.get(item, 'properties.requestQuote[0]', null);
  const byoModelName = _.get(item, 'name', '');

  const openModal = () => {
    // console.log(isModalOpen);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setUrl(false);
  };

  resolveInternalLinks(requestQuote, lang);
  resolveInternalLinks(item, lang);

  const getHitchLiftCapacity = (_item) => {
    const specs = _.get(_item, 'properties.specifications.items', []);
    const product = _.find(specs, (val) =>
      _.isEqual(val.content.properties.title, 'Hitch lift capacity'),
    );
    return product?.content?.properties?.valueText || '';
  };

  const getHitchLiftCapacityOp1 = (_item) => {
    const specs = _.get(_item, 'properties.specifications.items', []);
    const product = _.find(specs, (val) =>
      _.isEqual(val.content.properties.title, 'Hitch lift capacity'),
    );
    return product?.content?.properties?.option1 || '';
  };

  const plantingSpeed = _.get(item, 'properties.specifications.items', []).find(
    (specItem) => _.get(specItem, 'content.properties.title') === 'Planting speed',
  );

  const displacement = _.get(item, 'properties.specifications.items', []).find(
    (specItem) => _.get(specItem, 'content.properties.title') === 'Displacement',
  );

  const workingSpeed = _.get(item, 'properties.specifications.items', []).find(
    (specItem) => _.get(specItem, 'content.properties.title') === 'Working speed',
  );

  const boreStroke = _.get(item, 'properties.specifications.items', []).find(
    (specItem) => _.get(specItem, 'content.properties.title') === 'Bore x Stroke',
  );

  const powerLabel = getProductPower(item, lang, category);

  return (
    <>
      <div
        className="flex h-full w-[35%] flex-col overflow-hidden 
      pl-4 xl:pl-8 2xl:pl-10 3xl:w-[25.42%]">
        {/* {hasLabel && (
          <div className="font-noto text-clamp12to15 font-bold uppercase tracking-[1.5px] text-cherry">
            {getTranslationByKey('Tractor Model', translations, lang)}
          </div>
        )} */}
        {_.isEmpty(image) || (
          <div className="!relative min-h-[4rem] w-full grow">
            <Image
              src={image.url}
              alt={image.name}
              fill
              priority
              className="!w-auto !object-contain"
            />
          </div>
        )}
        <div className="inline-flex flex-row flex-wrap items-center gap-2 pt-[28px]">
          <span className="promo-font text-clamp36to62 font-medium leading-1">{name}</span>
          {_.isEmpty(item.properties.productTag) || (
            <div className="flex flex-wrap gap-1.5">
              {_.map(item.properties.productTag, (productTag, productTagIndex) => (
                <div
                  key={productTagIndex}
                  className={`
                  ${productTag === 'New' ? 'bg-[#CC9E00] uppercase' : 'bg-[#71A330]'} 
                  flex h-fit items-center justify-center rounded-[4px] px-3 py-1.5 
                  font-noto text-[13px] font-medium text-white`}>
                  {getTranslationByKey(productTag, translations, lang)}
                </div>
              ))}
            </div>
          )}
        </div>

        {_.isEmpty(engineLogoNav) || (
          <div className="flex flex-row items-center gap-4 pt-2 xl:pt-3 2xl:gap-6 4xl:pt-5">
            <p
              className="m-0 min-w-[120px] font-noto text-[15px] font-normal text-primary
              lg:leading-[24px]">
              {getTranslationByKey('Engine brand', translations, lang)}
            </p>
            <div className="!relative flex min-h-[1rem] w-full max-w-[88px] items-center">
              <Image
                src={engineLogoNav.url}
                alt="Engine Brand"
                fill
                className="!relative !h-auto !w-full !object-cover 2xl:min-h-[10px]"
              />
            </div>
          </div>
        )}

        <div className="flex flex-row gap-4 pt-1 xl:pt-2 2xl:gap-6 4xl:pt-3">
          <p
            className="m-0 min-w-[120px] font-noto text-[15px] font-normal text-primary
            lg:leading-[24px]">
            {getTranslationByKey('Performance', translations, lang)}
          </p>
          <h3 className="font-noto text-[15px] font-bold text-primary lg:leading-[24px]">
            {powerLabel.replace(/[()]/g, '')}
          </h3>
        </div>
        {_.isEmpty(getHitchLiftCapacity(item)) || (
          <div className="flex flex-row gap-4 pt-1 xl:pt-2 2xl:gap-6 4xl:pt-3">
            <p
              className="m-0 min-w-[120px] font-noto text-[15px] font-normal text-primary
              lg:leading-[24px]">
              {getTranslationByKey('Hitch lift capacity', translations, lang)}
            </p>
            <div>
              <h3
                className="font-noto text-[15px] font-bold text-primary lg:leading-[24px]"
                dangerouslySetInnerHTML={{ __html: getHitchLiftCapacity(item) }}
              />
              <span className="font-noto text-[15px] font-bold text-primary lg:leading-[24px]">
                {getHitchLiftCapacityOp1(item)}
              </span>
            </div>
          </div>
        )}
        {_.isEmpty(plantingSpeed) || (
          <div className="flex flex-row gap-4 pt-1 xl:pt-2 2xl:gap-6 4xl:pt-3">
            <p
              className="m-0 min-w-[120px] font-noto text-[15px] font-normal text-primary
              lg:leading-[24px]">
              {getTranslationByKey('Planting speed', translations, lang)}
            </p>
            <h3 className="font-noto text-[15px] font-bold text-primary lg:leading-[24px]">
              {plantingSpeed.content.properties.valueMetric}{' '}
              {plantingSpeed.content.properties.unitMetric}
            </h3>
          </div>
        )}
        {_.isEmpty(workingSpeed) || (
          <div className="flex flex-row gap-4 pt-1 xl:pt-2 2xl:gap-6 4xl:pt-3">
            <p
              className="m-0 min-w-[120px] font-noto text-[15px] font-normal text-primary
              lg:leading-[24px]">
              {getTranslationByKey('Working Speed', translations, lang)}
            </p>
            <h3 className="font-noto text-[15px] font-bold text-primary lg:leading-[24px]">
              {workingSpeed.content.properties.valueMetric}{' '}
              {workingSpeed.content.properties.unitMetric}
            </h3>
          </div>
        )}
        {category === 'Diesel Engines' && !_.isEmpty(displacement) && (
          <div className="flex flex-row gap-4 pt-1 xl:pt-2 2xl:gap-6 4xl:pt-3">
            <p
              className="m-0 min-w-[120px] font-noto text-[15px] font-normal text-primary
              lg:leading-[24px]">
              {getTranslationByKey('Displacement', translations, lang)}
            </p>
            <h3 className="font-noto text-[15px] font-bold text-primary lg:leading-[24px]">
              {displacement.content.properties.valueText}
            </h3>
          </div>
        )}
        {_.isEmpty(boreStroke) || (
          <div className="flex flex-row gap-4 pt-1 xl:pt-2 2xl:gap-6 4xl:pt-3">
            <p
              className="m-0 min-w-[120px] font-noto text-[15px] font-normal text-primary
              lg:leading-[24px]">
              {getTranslationByKey('Bore x Stroke', translations, lang)}
            </p>
            <h3 className="font-noto text-[15px] font-bold text-primary lg:leading-[30px]">
              {boreStroke.content.properties.valueMetric} {boreStroke.content.properties.unitMetric}
            </h3>
          </div>
        )}

        <div
          data-tractors={_.isEqual(category, 'Tractors') || _.isEqual(category, 'Harvesters')}
          className="grid grid-cols-2 gap-2 pt-4 data-[tractors=false]:max-w-[144px] data-[tractors=false]:grid-cols-1 xl:pt-6
          4xl:gap-4 4xl:pt-8">
          {_.isEmpty(path) || (
            <Link
              href={item?.route?.path || '#'}
              className="header-see-details-button flex items-center justify-center border-none bg-cherry px-2.5
              py-3 text-center text-[12px] font-bold uppercase leading-1.625 text-white
              hover:bg-paprika hover:text-white">
              {getTranslationByKey('See Details', translations, lang)}
            </Link>
          )}
          {_.isEmpty(childrenProducts) ? (
            <>
              {_.isEmpty(requestQuote) || (
                <a
                  href={`${requestQuote?.route?.path}?category=${category}&model=${name}`}
                  className="header-request-a-quote-button flex justify-center border-none bg-cherry px-2.5 py-3
              text-center text-[12px] font-bold uppercase leading-1.625 text-white
              hover:bg-paprika hover:text-white">
                  {getTranslationByKey('Request Quote', translations, lang)}
                </a>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setUrl(`${requestQuote?.route?.path}?category=${category}&model=`);
                openModal();
              }}
              data-tractors={_.isEqual(category, 'Tractors')}
              className="header-configure-tractor-button flex justify-center whitespace-pre border-none bg-cherry px-2.5
              py-3 text-center text-[12px] font-bold uppercase leading-1.625 text-white
              hover:bg-paprika hover:text-white data-[tractors=false]:hidden">
              {getTranslationByKey('Request Quote', translations, lang)}
            </button>
          )}

          {_.isEmpty(childrenProducts) ? (
            <>
              <Link
                href={getProductBuildYourOwnLink(lang, modelName, modelId, true)}
                target="_blank"
                data-tractors={_.isEqual(category, 'Tractors') && !_.isEmpty(modelId)}
                className="header-configure-tractor-button flex justify-center whitespace-pre border-none bg-cherry px-2.5
                py-3 text-center text-[12px] font-bold uppercase leading-1.625 text-white
                hover:bg-paprika hover:text-white data-[tractors=false]:hidden">
                {getTranslationByKey('Configure Tractor', translations, lang)}
              </Link>
              <Link
                href={getProductBuildYourOwnLink(lang, modelName, modelId, false)}
                target="_blank"
                data-tractors={
                  (!_.isEmpty(item.properties.product3DId) && _.isEqual(category, 'Tractors')) ||
                  _.isEqual(category, 'Harvesters')
                }
                className="header-explore-3d-button flex items-center justify-center border-none bg-cherry
                px-2.5 py-3 text-center text-[12px] font-bold uppercase leading-1.625 text-white
                hover:bg-paprika hover:text-white data-[tractors=false]:hidden">
                {getTranslationByKey('Explore 3d Model', translations, lang)}
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setConfigure(true);
                  openModal();
                }}
                data-tractors={_.isEqual(category, 'Tractors')}
                className="header-configure-tractor-button flex justify-center whitespace-pre whitespace-pre border-none bg-cherry
                px-2.5 py-3 text-[12px] font-bold uppercase leading-1.625 text-white
                hover:bg-paprika hover:text-white data-[tractors=false]:hidden">
                {getTranslationByKey('Configure Tractor', translations, lang)}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfigure(false);
                  openModal();
                }}
                data-tractors={
                  _.isEqual(category, 'Tractors') ||
                  (_.isEqual(category, 'Harvesters') && !_.isEmpty(modelId))
                }
                className="header-explore-3d-button flex items-center justify-center whitespace-pre border-none bg-cherry
                px-2.5 py-3 text-[12px] font-bold uppercase leading-1.625 text-white
                hover:bg-paprika hover:text-white data-[tractors=false]:hidden">
                {getTranslationByKey('Explore 3d Model', translations, lang)}
              </button>
            </>
          )}
        </div>
      </div>
      {!_.isEmpty(childrenProducts) && isModalOpen && (
        <Modal parent={item} closeModal={closeModal} configure={configure} url={url} />
      )}
    </>
  );
}

export default HeaderDesktopProductsMenuInnerCard;
