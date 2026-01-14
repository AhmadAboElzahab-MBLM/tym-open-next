import React, { useContext } from 'react';
import _ from 'lodash';
import Image from 'next/image';
import GlobalContext from '@/context/global-context';
import { getProductPower } from '@/helpers/product-handlers';

function HeaderDesktopProductsMenuInnerSeriesItem({ item, handleClick, selectedProductId }) {
  const { lang } = useContext(GlobalContext);
  const itemImage = _.get(item, 'properties.navigationThumbSideImage[0]', null);
  const itemName = _.get(item, 'properties.title', null) || _.get(item, 'name', '');
  const itemSpecLabel = getProductPower(item, lang);

  const normalize = (val) =>
    val
      ? String(val)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
      : '';

  const isSelected =
    normalize(_.get(item, 'properties.title', '')) === normalize(selectedProductId);

  return (
    <button
      type="button"
      onClick={() => handleClick(item)}
      className="header-products-series-item-button group flex h-auto w-full items-center gap-1
      transition-all duration-400 xl:px-2 2xl:gap-3">
      {_.isEmpty(itemImage) || (
        <Image
          alt={itemImage.name}
          src={itemImage.url}
          width={56}
          height={38}
          className="!relative hidden !h-auto !w-[27.5%] !max-w-[58px] !object-contain xl:block"
        />
      )}
      <span
        data-selected={isSelected}
        className="text-left font-noto text-clamp12to15 font-normal leading-1.875 text-primary 
        group-hover:text-cherry data-[selected=true]:font-bold data-[selected=true]:text-cherry">
        {itemName} {itemSpecLabel ? `${itemSpecLabel}` : ''}
      </span>
    </button>
  );
}

export default HeaderDesktopProductsMenuInnerSeriesItem;
