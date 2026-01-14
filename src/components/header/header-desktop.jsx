import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import HeaderDesktopApplicationsMenu from '@/components/header/header-desktop-applications-menu';
import HeaderDesktopLinksMenu from '@/components/header/header-desktop-links-menu';
import _, { isEqual } from 'lodash';
import HeaderDesktopProductsMenu from '@/components/header/header-desktop-products-menu';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import { usePathname } from 'next/navigation';
import useReturnCursor from '@/hooks/use-return-cursor';
import Icons from '../layout/icons';
import BoxedContainer from '../layout/boxed-container';

export default function HeaderDesktop({
  data,
  productsNavigation,
  atTop,
  navOpen,
  setNavOpen,
  products,
  isDetail,
  applicationsNavigation,
  search,
  region,
  lang,
  productsCategoryLinks,
  isDarkNav,
}) {
  const items = _.get(data, 'items', []);
  const path = usePathname();
  const homePrefix = ['/en', '/ko', '/en-ko', '/en-us'];
  const homePage = homePrefix.some((val) => _.isEqual(val, path));
  const [logo, setLogo] = useState('');
  const [selectedView, setSelectedView] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedContent, setSelectedContent] = useState([]);
  const isIseki = path.includes('iseki-50-years');
  const isBuildYourOwn = path.includes('build-your-own');

  const handleProductClick = (val, view = 'products') => {
    const groupName = _.get(val, 'groupName', '');
    const prodItems = _.get(val, 'items.items', []);

    if (isEqual(selectedTitle, groupName)) {
      setSelectedTitle('');
      setNavOpen(() => false);
      setSelectedView('');
      setSelectedContent([]);
    } else {
      setSelectedTitle(groupName);
      setNavOpen(() => true);
      setSelectedView(view);
      setSelectedContent(prodItems);
    }
  };

  const handleLinkClick = (val, view = 'links') => {
    const groupName = _.get(val, 'content.properties.groupName', '');
    if (isEqual(selectedTitle, groupName)) {
      setSelectedTitle('');
      setNavOpen(() => false);
      setSelectedView('');
    } else {
      setSelectedTitle(groupName);
      setNavOpen(() => true);
      setSelectedView(view);
    }
  };

  const handleApplicationClick = (val, view = 'application') => {
    const groupName = _.get(val, 'groupName', '');
    const applications = _.get(val, 'items.items', []);
    if (isEqual(selectedTitle, groupName)) {
      setSelectedTitle('');
      setNavOpen(() => false);
      setSelectedView('');
      setSelectedContent([]);
    } else {
      setSelectedTitle(groupName);
      setNavOpen(() => true);
      setSelectedView(view);
      setSelectedContent(applications);
    }
  };

  function splitArrayIntoTwo(array = []) {
    const halfLength = Math.ceil(array.length / 2);
    const chunks = _.chunk(array, halfLength);

    const ind = chunks[0]?.findIndex(
      (obj) =>
        obj.content.properties.groupName === 'Technology' ||
        obj.content.properties.groupName === '기술',
    );

    if (ind !== -1) {
      const elm = chunks[0]?.splice(ind, 1)[0];
      chunks[1]?.unshift(elm);
    }

    return chunks;
  }

  const [firstHalf, secondHalf] = splitArrayIntoTwo(items);

  const { toggleCursor } = useReturnCursor(() => {
    toggleCursor(false);
    setNavOpen(false);
    setSelectedView('');
    setSelectedTitle('');
    setSelectedContent([]);
  });

  useEffect(() => {
    toggleCursor(false);
  }, []);

  useEffect(() => {
    const getLogo = () => {
      if (!atTop) return 'TymSmallLogo';
      if (isDarkNav && !atTop) return 'TymSmallLogo';
      if (isDarkNav && navOpen) return 'TymSmallLogo';
      if (isDarkNav) return 'LogoDark';
      if (navOpen) return 'TymSmallLogo';
      if (homePage && atTop) return 'LogoLight';
      if (homePage && !atTop) return 'TymSmallLogo';
      if (isBuildYourOwn) return 'TymSmallLogo';
      if (!homePage && !atTop) return 'TymSmallLogo';
      if (!homePage && atTop) return 'LogoDark';
      return '';
    };
    const newLogo = getLogo();
    setLogo(newLogo);
  }, [navOpen, atTop, path, homePage, isDarkNav]);

  useEffect(() => {
    setNavOpen(false);
    setSelectedView('');
    setSelectedContent([]);
  }, [path]);

  const [visibleLogo, setVisibleLogo] = useState('');
  const [logoOpacity, setLogoOpacity] = useState(0);

  // Sync with current logo with fade transition
  useEffect(() => {
    if (!logo && !isDetail && !isIseki) return;

    // Step 1: Fade out
    setLogoOpacity(0);

    const timeout = setTimeout(() => {
      // Step 2: Change the logo name after fade out
      setVisibleLogo(isDetail || isIseki ? 'LogoDetails' : logo);

      // Step 3: Fade in
      setLogoOpacity(1);
    }, 180); // matches transition duration

    return () => clearTimeout(timeout);
  }, [logo, isDetail, isIseki]);

  return (
    <div
      data-nav-open={navOpen}
      className="data-[nav-open=true]:fixed data-[nav-open=true]:h-screen data-[nav-open=true]:w-[100%] data-[nav-open=true]:max-w-[100%] data-[nav-open=true]:!bg-porcelain">
      <BoxedContainer>
        <div
          data-at-top={atTop}
          data-dark-nav={isDarkNav}
          className="hidden flex-row justify-between gap-x-[20px] pb-7.5 pt-12 transition-all duration-300 lg:flex lg:gap-x-[50px] 5xl:pt-18.5">
          <a href={`/${lang}` || '#'} className="header-logo pt-2">
            {visibleLogo && (
              <div
                className={`transition-opacity duration-300 ease-in-out ${logoOpacity === 1 ? 'opacity-100' : 'opacity-0'}`}>
                <Icons name={visibleLogo} className="w-20 3xl:w-28 4xl:w-34" />
              </div>
            )}
          </a>

          <div className="flex h-fit flex-row gap-x-4 pt-1.5 lg:gap-x-6.5 xl:gap-x-8">
            {_.isEmpty(productsNavigation) || (
              <button
                type="button"
                onClick={() => handleProductClick(productsNavigation)}
                data-open={navOpen}
                data-home-top={atTop}
                data-selected={selectedTitle === productsNavigation.groupName}
                data-dark-nav={isDarkNav}
                className={`header-product-navigation-button h-fit font-noto text-[18px] font-medium capitalize text-primary transition-[color,opacity] duration-300 ease-in-out data-[selected=true]:!text-cherry ${homePage ? 'data-[home-top=true]:text-white' : ''} data-[dark-nav=true]:!text-primary data-[open=true]:!text-primary`}>
                {productsNavigation.groupName}
              </button>
            )}

            {_.map(firstHalf, (val, index) => {
              const item = _.get(val, 'content.properties');
              const hasInnerLinks = _.get(item, 'links', []).length > 1;
              const itemUrl =
                _.get(item, 'links[0].route.path', null) || _.get(item, 'links[0].url', '#');
              const target = _.get(item, 'links[0].target');
              const groupName = _.get(item, 'groupName', '');

              if (hasInnerLinks) {
                return (
                  <button
                    type="button"
                    data-open={navOpen}
                    key={groupName + index}
                    data-selected={selectedTitle === groupName}
                    onClick={() => handleLinkClick(val)}
                    data-home-top={atTop && homePage}
                    data-dark-nav={isDarkNav}
                    className="h-fit font-noto text-[18px] font-medium text-primary transition-[color,opacity] duration-300 ease-in-out data-[dark-nav=true]:!text-primary data-[home-top=true]:text-white data-[open=true]:!text-primary data-[selected=true]:!text-cherry">
                    {groupName}
                  </button>
                );
              }

              return (
                <Link
                  href={itemUrl || '#'}
                  target={target}
                  type="button"
                  data-open={navOpen}
                  key={groupName + index}
                  data-home-top={atTop && homePage}
                  data-dark-nav={isDarkNav}
                  className={`h-fit font-noto text-[18px] font-medium text-primary transition-[color,opacity] duration-300 ease-in-out ${
                    isDarkNav
                      ? 'data-[home-top=true]:!text-black'
                      : 'data-[home-top=true]:text-white'
                  } data-[open=true]:!text-primary`}>
                  {groupName}
                </Link>
              );
            })}

            {_.isEmpty(applicationsNavigation) || (
              <button
                type="button"
                onClick={() => handleApplicationClick(applicationsNavigation)}
                data-open={navOpen}
                data-selected={selectedTitle === applicationsNavigation.groupName}
                data-home-top={atTop}
                data-dark-nav={isDarkNav}
                className={`header-application-navigation-button h-fit font-noto text-[18px] font-medium text-primary transition-all duration-300 data-[selected=true]:!text-cherry ${homePage ? 'data-[home-top=true]:text-white' : ''} data-[dark-nav=true]:!text-primary data-[open=true]:!text-primary`}>
                {applicationsNavigation.groupName}
              </button>
            )}

            {_.map(secondHalf, (val, index) => {
              const item = _.get(val, 'content.properties');
              const hasInnerLinks = _.get(item, 'links', []).length > 1;
              resolveInternalLinks(item?.links[0], lang);
              const itemUrl =
                _.get(item, 'links[0].route.path', null) || _.get(item, 'links[0].url', '/');
              const groupName = _.get(item, 'groupName', '#');

              // const url = _.get(item, 'links[0].url');

              if (groupName !== 'Contact') {
                if (hasInnerLinks) {
                  return (
                    <button
                      type="button"
                      data-open={navOpen}
                      key={groupName + index}
                      data-selected={selectedTitle === groupName}
                      onClick={() => handleLinkClick(val)}
                      data-home-top={atTop && homePage}
                      data-dark-nav={isDarkNav}
                      className="header-innerlinks-navigation-button h-fit font-noto text-[18px] font-medium text-primary transition-all duration-300 data-[dark-nav=true]:!text-primary data-[home-top=true]:text-white data-[open=true]:!text-primary data-[selected=true]:!text-cherry">
                      {groupName}
                    </button>
                  );
                }

                return (
                  <Link
                    href={itemUrl || '#'}
                    type="button"
                    data-open={navOpen}
                    data-home-top={atTop && homePage}
                    data-dark-nav={isDarkNav}
                    key={groupName + index}
                    className="h-fit font-noto text-[18px] font-medium text-primary transition-all duration-300 data-[home-top=true]:text-white data-[open=true]:!text-primary">
                    {groupName}
                  </Link>
                );
              }
            })}
            {_.isEmpty(search) || (
              <>
                {resolveInternalLinks(search[0], lang)}
                <Link
                  href={search[0].route.path || '#'}
                  type="button"
                  data-open={navOpen}
                  data-home-top={atTop}
                  className={`search-button h-fit svg-child-circle:stroke-primary svg-child-path:stroke-primary [&>svg>circle]:transition-all [&>svg>circle]:duration-300 [&>svg>path]:transition-all [&>svg>path]:duration-300 ${navOpen ? 'svg-child-circle:!stroke-primary svg-child-path:!stroke-primary' : ''} ${atTop && homePage && !isDarkNav ? '[&>svg>circle]:stroke-white [&>svg>path]:stroke-white' : ''} ${isDarkNav && homePage ? '[&>svg>circle]:stroke-black [&>svg>path]:stroke-black' : ''} `}>
                  <Icons name="Search" />
                </Link>
              </>
            )}
          </div>
        </div>
      </BoxedContainer>
      <div
        className="4xl:px-24"
        onMouseEnter={() => toggleCursor(true)}
        onMouseLeave={() => toggleCursor(false)}>
        {(() => {
          switch (selectedView) {
            case 'products':
              return (
                <HeaderDesktopProductsMenu
                  data={selectedContent}
                  products={products}
                  region={region}
                  lang={lang}
                  isOpen={navOpen}
                  toggleCursor={toggleCursor}
                  productsCategoryLinks={productsCategoryLinks}
                />
              );
            case 'application':
              return (
                <HeaderDesktopApplicationsMenu
                  data={selectedContent}
                  lang={lang}
                  toggleCursor={toggleCursor}
                />
              );
            case 'links':
              return (
                <HeaderDesktopLinksMenu
                  toggleCursor={toggleCursor}
                  lang={lang}
                  selectedTitle={selectedTitle}
                  allItems={_.filter(items, (val) => {
                    const innerLinks = _.get(val, 'content.properties.links', []);
                    // console.log(innerLinks);
                    return innerLinks.length > 1;
                  })}
                />
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}
