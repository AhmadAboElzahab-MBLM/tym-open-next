/* eslint-disable react/no-danger */
import React, { useContext, useState, useEffect } from 'react';
import _ from 'lodash';
import Link from 'next/link';
import Icons from '@/components/layout/icons';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';
import useScrollBottom from '@/hooks/use-scroll-bottom';
import { usePathname } from 'next/navigation';
import FooterRegionPopup from './footer-region-popup';

function FooterDesktopBottom({
  subcontractors,
  copyright,
  bottomLinks,
  region,
  translations,
  southKoreaText,
  northAmericaText,
  internationalText,
  dealershipIntl,
  dealershipNa
}) {
  const { lang } = useContext(GlobalContext);
  const path = usePathname();
  const locale = path.split('/').filter(Boolean)[0];
  const scrollToBottom = useScrollBottom();

  const [regionsMenu, setRegionsMenu] = useState(false);
  const regions = {
    en: 'International',
    ko: '한국 (KO)',
    de: 'Deutschland',
    'en-ko': 'South Korea',
    'en-us': 'North America',
  };

  const handleRegionChange = (_region) => {
    const regionPairs = _.toPairs(regions);
    const currentRegion = _.find(regionPairs, (val) => val[0] === locale);
    const givenRegion = _.find(regionPairs, (val) => val[0] === _region);
    setRegionsMenu(false);
    document.body.style.overflow = '';
    window.location.href = _.replace(path, currentRegion[0], givenRegion[0]);
  };

  const handleLocaleButtonClick = () => {
    if (regionsMenu) {
      setRegionsMenu(false);
      document.body.style.overflow = '';
    } else {
      setRegionsMenu(true);
      document.body.style.overflow = 'hidden';
      scrollToBottom();
    }
  };

  const handleCloseModal = () => {
    setRegionsMenu(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const isNaOrInt = _.includes(['North America', 'International'], region);


  return (
    <>
      <div className="flex flex-col border-t border-t-whiteBlur pt-10 md:pt-4">
        <div className="flex flex-col justify-between gap-y-5 md:flex-row md:gap-y-0 md:pt-[20px]">
          <div className="flex flex-row items-center gap-x-3">
            <button
              type="button"
              className="relative z-[51] flex items-center gap-3 region-selector-button"
              onClick={handleLocaleButtonClick}>
              <Icons name="World" className="text-white" />
              <span className="bg-primary font-noto text-[15px] font-normal text-white">
                {regions[locale]}
              </span>
            </button>
          </div>
          <div
            className="lg2:w-[745px] flex flex-col justify-between gap-y-5 md:w-[70%]
            md:flex-row md:items-center md:gap-y-0 lg:w-[66%] 3xl:w-[807px]">
            {_.isEmpty(copyright) || (
              <div
                className="font-noto text-[15px] font-normal leading-1.25 text-white"
                dangerouslySetInnerHTML={{
                  __html: _.replace(copyright, '{{YEAR}}', new Date().getFullYear()),
                }}
              />
            )}

            <div className="flex flex-col gap-4">

              {(region === "South Korea" || region === "한국") && !_.isEmpty(subcontractors) && (
                <div className="flex items-center gap-4">
                  <span className="font-noto text-[15px] font-normal leading-1.25 text-white">
                    {getTranslationByKey('Dealership', translations, lang)}
                  </span>
                  <div className="flex flex-row items-center gap-x-3">
                    {_.map(subcontractors, (item, index) => {
                      if (!_.isEmpty(item)) {
                        return (
                          <Link
                            key={index}
                            target={item?.target}
                            href={item?.url || '#'}
                            className="rounded-full bg-cherry px-3 py-1.5 font-noto text-[15px]
                            font-normal leading-1 text-white footer-subcontractors-links"
                          >
                            {item.title}
                          </Link>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              {(region === "North America") && !_.isEmpty(dealershipNa) && (
                <div className="flex items-center gap-4">
                  <span className="font-noto text-[15px] font-normal leading-1.25 text-white">
                    {getTranslationByKey('Dealership', translations, lang)}
                  </span>
                  <div className="flex flex-row items-center gap-x-3">
                    {_.map(dealershipNa, (item, index) => {
                      if (!_.isEmpty(item)) {
                        return (
                          <Link
                            key={index}
                            target={item?.target}
                            href={item?.url || '#'}
                            className="rounded-full bg-cherry px-3 py-1.5 font-noto text-[15px]
                            font-normal leading-1 text-white footer-subcontractors-links"
                          >
                            {item.title}
                          </Link>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              {(region === "International") && !_.isEmpty(dealershipIntl) && (
                <div className="flex items-center gap-4">
                  <span className="font-noto text-[15px] font-normal leading-1.25 text-white">
                    {getTranslationByKey('Dealership', translations, lang)}
                  </span>
                  <div className="flex flex-row items-center gap-x-3">
                    {_.map(dealershipIntl, (item, index) => {
                      if (!_.isEmpty(item)) {
                        return (
                          <Link
                            key={index}
                            target={item?.target}
                            href={item?.url || '#'}
                            className="rounded-full bg-cherry px-3 py-1.5 font-noto text-[15px]
                            font-normal leading-1 text-white footer-subcontractors-links"
                          >
                            {item.title}
                          </Link>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
              
              <div className="flex flex-col gap-[20px] md:flex-row lg:gap-x-[60px]">
                {_.map(bottomLinks, (item, index) => {
                  resolveInternalLinks(item, lang);
                  return (
                    <Link
                      key={index}
                      href={item?.url || '#'}
                      className="relative w-fit font-noto text-[15px] font-normal leading-1
                      text-white hover:text-tymRed footer-bottom-links">
                      {item?.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {regionsMenu && (
        <FooterRegionPopup
          handleRegionChange={handleRegionChange}
          handleCloseModal={handleCloseModal}
          internationalText={internationalText}
          northAmericaText={northAmericaText}
          southKoreaText={southKoreaText}
        />
      )}
    </>
  );
}

export default FooterDesktopBottom;
