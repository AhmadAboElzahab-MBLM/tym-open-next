import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import useScroll from '@/hooks/use-scroll';
import { usePathname } from 'next/navigation';
import useWindowResize from '@/hooks/use-window-resize';
import HeaderDesktop from '@/components/header/header-desktop';
import HeaderMobile from '@/components/header/header-mobile';
import HeaderMobileMenu from '@/components/header/header-mobile-menu';

export default function Header({ id, data, lang, region, isDetail, products, isDarkNav }) {
  const mainNavigation = _.get(data, 'properties.mainNavigation', []);
  const searchPageUrl = _.get(data, 'properties.searchPageUrl', '');
  const productsCategoryLinks = _.get(data, 'properties.productsCategoryLinks.items', []);
  const { position, visible } = useScroll();
  const [isOpen, setIsOpen] = useState(false);
  const [desktopNavOpen, setDesktopNavOpen] = useState(false);
  const productsNavigation = _.get(
    data,
    'properties.productsNavigation.items[0].content.properties',
    null,
  );
  const applicationsNavigation = _.get(
    data,
    'properties.applicationsNavigation.items[0].content.properties',
    null,
  );

  const paths = ['/en', '/en-ko', '/en-us', '/ko'];

  const path = usePathname();
  const homePath = `/${path.split('/').filter(Boolean)[0]}`;
  const isHome = _.some(paths, (_path) => _.isEqual(path, _path));
  const isBuildYourOwn = path.includes('build-your-own');

  const atTop = useMemo(() => position <= 30, [position]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const { width } = useWindowResize();

  const isDesktop = width >= 1024;

  // console.log('productsCategoryLinks', productsCategoryLinks);
  // console.log('products', products);
  // console.log('productsNavigation', productsNavigation);
  // console.log('data', data);

  useEffect(() => {
    if (isDesktop) {
      setIsOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  // console.log(productsCategoryLinks);

  return (
    <>
      <header
        id={id}
        data-visible={visible}
        data-nav-open={isOpen || desktopNavOpen}
        data-at-top={atTop && isHome}
        className={`fixed top-0 z-50 w-full -translate-y-full ${isBuildYourOwn && !isOpen && !desktopNavOpen ? 'bg-opacity-70' : 'bg-opacity-100'} bg-white transition-all duration-[300ms] data-[visible=true]:translate-y-0 data-[at-top=true]:bg-transparent data-[nav-open=true]:!bg-porcelain`}>
        {isDesktop ? (
          <HeaderDesktop
            data={mainNavigation}
            productsCategoryLinks={productsCategoryLinks}
            productsNavigation={productsNavigation}
            applicationsNavigation={applicationsNavigation}
            atTop={atTop}
            navOpen={desktopNavOpen}
            setNavOpen={setDesktopNavOpen}
            products={products}
            isDetail={isDetail}
            search={searchPageUrl}
            region={region}
            lang={lang}
            isDarkNav={isDarkNav}
          />
        ) : (
          <HeaderMobile
            position={position}
            handleClick={handleClick}
            isOpen={isOpen}
            isHome={isHome}
            homePath={homePath}
            lang={lang}
          />
        )}
      </header>
      {!isDesktop && isOpen && (
        <HeaderMobileMenu
          data={mainNavigation}
          handleClick={handleClick}
          products={products}
          productsNavigation={productsNavigation}
          applicationsNavigation={applicationsNavigation}
          productsCategoryLinks={productsCategoryLinks}
        />
      )}
    </>
  );
}
