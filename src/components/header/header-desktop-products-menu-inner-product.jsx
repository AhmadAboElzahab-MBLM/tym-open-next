/* eslint-disable no-nested-ternary */
import React, { useContext } from 'react';
import _ from 'lodash';
import GlobalContext from '@/context/global-context';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

function HeaderDesktopProductsMenuInnerProduct({
  item,
  selected,
  handleClick,
  selectedCategory,
  selectedProductId,
  clickedProductTitle,
}) {
  const image = _.get(item, 'properties.featuresImage[0]', {});
  const navigationSideImage = _.get(item, 'properties.navigationSideImage[0]', {});
  const name = _.get(item, 'properties.title', {});
  const { lang } = useContext(GlobalContext);
  const enginePowerItem = _.get(item, 'properties.specifications.items', []).find(
    (specItem) => _.get(specItem, 'content.properties.title') === 'Engine power',
  );
  const workingSpeed = _.get(item, 'properties.specifications.items', []).find(
    (specItem) => _.get(specItem, 'content.properties.title') === 'Working speed',
  );
  const plantingSpeed = _.get(item, 'properties.specifications.items', []).find(
    (specItem) => _.get(specItem, 'content.properties.title') === 'Planting speed',
  );
  const displacement = _.get(item, 'properties.specifications.items', []).find(
    (specItem) => _.get(specItem, 'content.properties.title') === 'Displacement',
  );
  const pathUrl = usePathname();
  const koPaths = ['/ko', '/en-ko'];
  const isKO = _.some(koPaths, (koPath) => _.includes(pathUrl, koPath));
  const normalize = (val) =>
    val
      ? String(val)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
      : '';

  // Get the item's path
  const itemPath = _.get(item, 'route.path', '');
  const isPathMatch = pathUrl === itemPath;

  const isSelected =
    (clickedProductTitle &&
      normalize(_.get(item, 'properties.title', '')) === normalize(clickedProductTitle)) ||
    isPathMatch;

  return (
    <button
      type="button"
      data-selected={isSelected}
      onClick={() => handleClick(item)}
      className="flex h-auto flex-col items-start overflow-hidden transition-all duration-400
      hover:bg-lightGrey data-[selected=true]:bg-lightGrey">
      <div className="flex h-full w-full flex-col justify-end gap-2 px-5 py-3">
        {selectedCategory === 'Rice Transplanters'
          ? _.isEmpty(navigationSideImage) || (
              <div className="relative !h-full !max-h-[130px] !min-h-[2rem]">
                <Image
                  alt={navigationSideImage.name}
                  src={navigationSideImage.url}
                  fill
                  className="!w-auto !object-contain"
                />
              </div>
            )
          : _.isEmpty(image) || (
              <div className="relative !h-full !max-h-[130px] !min-h-[2rem]">
                <Image alt={image.name} src={image.url} fill className="!w-auto !object-contain" />
              </div>
            )}
        <div className="flex w-full flex-wrap text-left">
          <span className="w-full font-noto font-bold">{name}</span>
          <div className="flex flex-wrap gap-1">
            {_.isEmpty(enginePowerItem) || (
              <span className="text-left font-noto text-clamp12to15">
                {selectedCategory === 'Diesel Engines' && enginePowerItem ? (
                  isKO || lang === 'ko' || lang === 'en-ko' ? (
                    `${enginePowerItem.content.properties.valueMetric} PS`
                  ) : (
                    `${enginePowerItem.content.properties.valueMetric} hp`
                  )
                ) : isKO ? (
                  <>
                    {enginePowerItem.content.properties.valueMetric}{' '}
                    {enginePowerItem.content.properties.unitMetric}
                  </>
                ) : (
                  <>
                    {enginePowerItem.content.properties.valueUS}{' '}
                    {enginePowerItem.content.properties.unitUS}
                  </>
                )}
              </span>
            )}{' '}
            {_.isEmpty(workingSpeed) || (
              <span className="text-left font-noto text-clamp12to15">
                , {workingSpeed.content.properties.valueText}
              </span>
            )}
            {_.isEmpty(plantingSpeed) || (
              <span className="text-left font-noto text-clamp12to15">
                , {plantingSpeed.content.properties.valueMetric}{' '}
                {plantingSpeed.content.properties.unitMetric}
              </span>
            )}
            {selectedCategory === 'Diesel Engines' && !_.isEmpty(displacement) && (
              <span className="text-left font-noto text-clamp12to15">
                , {displacement.content.properties.valueText}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export default HeaderDesktopProductsMenuInnerProduct;
