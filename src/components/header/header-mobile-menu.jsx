import React, { useCallback, useContext, useState } from 'react';
import _ from 'lodash';
import HeaderMobileMenuLinks from '@/components/header/header-mobile-menu-links';
import Link from 'next/link';
import HeaderMobileMenuApplications from '@/components/header/header-mobile-menu-applications';
import HeaderMobileMenuProducts from '@/components/header/header-mobile-menu-products';
import HeaderMobileMenuLangSwitcher from '@/components/header/header-mobile-menu-lang-switcher';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';
import BodyLock from '../layout/body-lock';

export default function HeaderMobileMenu({
  data,
  products,
  productsNavigation,
  applicationsNavigation,
  productsCategoryLinks,
}) {
  const { translations, lang, region } = useContext(GlobalContext);
  const [currView, setCurrView] = useState('menu');
  const [selectedContent, setSelectedContent] = useState({});
  const navigationItems = _.get(data, 'items', []);

  function splitArrayIntoTwo(array = []) {
    const halfLength = Math.ceil(array.length / 2);
    const chunks = _.chunk(array, halfLength);
    return chunks;
  }

  const [firstChunk, secondChunk] = splitArrayIntoTwo(navigationItems);

  const handleLinksMenu = (_val) => {
    const item = _.get(_val, 'content.properties', {});
    setSelectedContent(item);
    setCurrView('links');
    // console.log('links menu clicked');
  };

  const handleApplicationsMenu = () => {
    setCurrView('applications');
    // console.log('applications menu clicked');
  };

  const handleProductsMenu = () => {
    setCurrView('products');
    // console.log('products menu clicked');
  };

  // console.log(data);

  const viewSelector = useCallback(() => {
    switch (currView) {
      case 'menu':
        return (
          <div className="flex h-full w-full flex-col">
            <div className="flex h-full w-full flex-col items-start gap-7 px-7 py-5">
              <button
                type="button"
                className="h-fit font-noto text-[15px] font-bold uppercase tracking-widest
                text-cherry">
                {getTranslationByKey('menu', translations, lang)}
              </button>
              <div className="flex h-full w-full flex-col items-start gap-7">
                <button
                  type="button"
                  className="h-fit font-noto text-[15px] font-normal text-primary"
                  onClick={handleProductsMenu}>
                  {getTranslationByKey(productsNavigation.type, translations, lang)}
                </button>
                {_.map(firstChunk, (val, index) => {
                  const itemGroupName = _.get(val, 'content.properties.groupName');
                  const hasInnerLinks = _.get(val, 'content.properties.links', []).length > 1;
                  const itemUrl =
                    _.get(val, 'content.properties.links[0].route.path', null) ||
                    _.get(val, 'content.properties.links[0].url', '/');

                  if (hasInnerLinks) {
                    return (
                      <button
                        type="button"
                        key={index}
                        onClick={() => handleLinksMenu(val)}
                        className="h-fit font-noto text-[15px] font-normal text-primary">
                        {itemGroupName}
                      </button>
                    );
                  }

                  return (
                    <Link
                      href={itemUrl || '#'}
                      type="button"
                      key={index}
                      className="h-fit font-noto text-[15px] font-normal text-primary">
                      {itemGroupName}
                    </Link>
                  );
                })}
                <button
                  type="button"
                  className="h-fit font-noto text-[15px] font-normal text-primary"
                  onClick={handleApplicationsMenu}>
                  {applicationsNavigation.groupName}
                </button>
                {_.map(secondChunk, (val, index) => {
                  const itemGroupName = _.get(val, 'content.properties.groupName');
                  const hasInnerLinks = _.get(val, 'content.properties.links', []).length > 1;
                  resolveInternalLinks(val?.content?.properties?.links[0], lang);
                  const itemUrl =
                    _.get(val, 'content.properties.links[0].route.path', null) ||
                    _.get(val, 'content.properties.links[0].url', '#');

                  if (hasInnerLinks) {
                    return (
                      <button
                        type="button"
                        key={index}
                        onClick={() => handleLinksMenu(val)}
                        className="h-fit font-noto text-[15px] font-normal text-primary">
                        {itemGroupName}
                      </button>
                    );
                  }

                  return (
                    <Link
                      href={itemUrl || '#'}
                      type="button"
                      key={index}
                      className="h-fit font-noto text-[15px] font-normal text-primary">
                      {itemGroupName}
                    </Link>
                  );
                })}
              </div>
            </div>
            <HeaderMobileMenuLangSwitcher region={region} />
          </div>
        );
      case 'products':
        return (
          <HeaderMobileMenuProducts
            data={productsNavigation}
            products={products}
            handleViewChange={setCurrView}
            productsCategoryLinks={productsCategoryLinks}
          />
        );
      case 'applications':
        return (
          <HeaderMobileMenuApplications
            data={applicationsNavigation}
            handleViewChange={setCurrView}
          />
        );
      case 'links':
        return <HeaderMobileMenuLinks data={selectedContent} handleViewChange={setCurrView} />;
      default:
        return null;
    }
  }, [currView, products]);

  return (
    <>
      <BodyLock />
      <div
        className="fixed left-0 top-20 z-[60] flex h-[calc(100dvh-80px)] w-full flex-col
        bg-porcelain">
        {viewSelector()}
      </div>
    </>
  );
}
