import React from 'react';
import Link from 'next/link';
import _ from 'lodash';
import { usePathname } from 'next/navigation';
import FooterDesktopBottom from '@/components/footer/footer-desktop-bottom';
import Icons from '../layout/icons';
import FooterItemsDesktop from './footer-items-desktop';

export default function Footer({ data, region, lang, translations }) {
  const id = `footer-${_.kebabCase(region)}`;

  const footerNavigation = _.get(data, 'properties.footerNavigation.items', null);
  const naver = _.get(data, 'properties.naver', null);
  const twitter = _.get(data, 'properties.twitter', null);
  const tiktok = _.get(data, 'properties.tiktok', null);
  const instagram = _.get(data, 'properties.instagram', null);
  const youtube = _.get(data, 'properties.youtube', null);
  const linkedIn = _.get(data, 'properties.linkedIn', null);
  const facebook = _.get(data, 'properties.facebook', null);
  const vimeo = _.get(data, 'properties.vimeo', null);
  const privacyPolicy = _.get(data, 'properties.privacyPolicy[0]', null);
  const termsAndConditions = _.get(data, 'properties.termsAndConditions[0]', null);
  const copyright = _.get(data, 'properties.copyright', null);
  const footerText = _.get(data, 'properties.footerText.markup', '');
  const groupWebsiteUrl = _.get(data, 'properties.groupWebsiteUrl', '');
  const dealershipPortal = _.get(data, 'properties.dealershipPortal', '');
  const subcontractors = _.get(data, 'properties.subcontractors', null);
  const dealershipIntl = _.get(data, 'properties.dealershipIntl', null);
  const dealershipNa = _.get(data, 'properties.dealershipNa', null);
  const bottomLinks = [privacyPolicy, termsAndConditions];
  const socialMedia = { naver, twitter, facebook, instagram, linkedIn, youtube, vimeo };
  const paths = usePathname();
  const koPaths = ['/ko', '/en-ko'];
  const naPaths = ['/en-us'];
  const isKO = _.some(koPaths, (koPath) => _.includes(paths, koPath));
  const isNA = _.some(naPaths, (naPath) => _.includes(paths, naPath));
  const additionalLinks = isKO
    ? {
        facebook: 'https://www.facebook.com/tymtractors.kr',
        instagram: 'https://www.instagram.com/tymtractors_kr',
      }
    : {};
  const additionalLinksNA = isNA
    ? {
        linkedIn: 'https://www.linkedin.com/company/tym-tractors/',
        tiktok:tiktok,
      }
    : {};

  const combinedSocialMedia = {
    ...socialMedia,
    ...additionalLinks,
    ...additionalLinksNA,
  };

  const filteredSocialMedia = isKO
    ? _.omit(combinedSocialMedia, ['vimeo', 'twitter'])
    : _.omit(combinedSocialMedia, ['naver', 'vimeo']);
  const internationalText = _.get(data, 'properties.internationalText', '');
  const northAmericaText = _.get(data, 'properties.northAmericaText', '');
  const southKoreaText = _.get(data, 'properties.southKoreaText', '');
  const deutschlandText = _.get(data, 'properties.deutschlandText', '');
  const buildYourOwn = paths.includes('build-your-own');

  return (
    <footer id={id} className={`bg-primary relative z-10 py-10 md:pb-8 md:pt-16 ${buildYourOwn ? 'hidden' : ''}`}>
      <div className="container relative mx-auto px-4 3xl:max-w-[1314px] 3xl:px-0">
        <div className="flex flex-col gap-y-10 md:gap-y-[60px]">
          <div
            className="flex flex-col gap-y-10 lg:flex-row lg:gap-x-[50px] lg:gap-y-[0px]
            xl:gap-x-[100px] 2xl:gap-x-[154px]">
            <div className="flex flex-col gap-y-10 lg:max-w-[300px] xl:max-w-[352px]">
              <Link href={`/${lang}` || '#'} className="w-fit">
                <Icons name="GreyLogo" className="h-auto w-20 md:w-30 xl:w-[157px]" />
              </Link>
              {_.isEmpty(footerText) || (
                <div
                  className="font-noto text-[12px] font-normal leading-[24px] text-white
                  xl:pt-[20px] xl:text-[15px]"
                  dangerouslySetInnerHTML={{ __html: footerText }}
                />
              )}
              <div className="flex gap-x-4 md:gap-x-5">
                {_.map(
                  _.toPairs(filteredSocialMedia),
                  ([key, value]) =>
                    _.isEmpty(value) || (
                      <Link
                        key={key}
                        target="_blank"
                        href={value || '#'}
                        className="h-8 w-8 rounded-full bg-white">
                        <Icons name={_.upperFirst(key)} />
                      </Link>
                    ),
                )}
              </div>
              <div className="flex flex-col gap-2 lg:gap-5">
                {_.map(groupWebsiteUrl, (item, ind) => {
                  const itemUrl = _.get(item, 'url', '#');
                  const itemTitle = _.get(item, 'title', '');
                  return (
                    <Link
                      key={ind}
                      href={itemUrl}
                      target={item.target}
                      className="relative flex w-fit flex-row items-center gap-x-2 pt-[2px]
                      font-noto text-[12px] font-bold leading-[30px] text-white hover:text-tymRed
                      svg-child-path:!stroke-white svg-child-path:stroke-[1.5px]
                      hover:svg-child-path:!stroke-tymRed md:gap-x-[12px] xl:text-[15px]">
                      <Icons name="SliderRightArrow" />
                      <span>{itemTitle}</span>
                    </Link>
                  );
                })}
                {lang === 'en-us'
                  ? _.isEmpty(dealershipPortal) || (
                      <Link
                        href={dealershipPortal[0].url}
                        target={dealershipPortal[0].target}
                        className="relative flex w-fit flex-row items-center gap-x-2 pt-[2px]
                        font-noto text-[12px] font-bold leading-[30px] text-white hover:text-tymRed
                        svg-child-path:!stroke-white svg-child-path:stroke-[1.5px]
                        hover:svg-child-path:!stroke-tymRed md:gap-x-[12px] xl:text-[15px]">
                        <Icons name="SliderRightArrow" />
                        <span>{dealershipPortal[0].title}</span>
                      </Link>
                    )
                  : ''}
              </div>
            </div>
            <FooterItemsDesktop
              data={_.map(footerNavigation, (val) => val.content)}
              lang={lang}
              translations={translations}
            />
          </div>
          <FooterDesktopBottom
            region={region}
            subcontractors={subcontractors}
            dealershipNa={dealershipNa}
            dealershipIntl={dealershipIntl}
            bottomLinks={bottomLinks}
            copyright={copyright}
            translations={translations}
            lang={lang}
            northAmericaText={northAmericaText}
            internationalText={internationalText}
            deutschlandText={deutschlandText}
            southKoreaText={southKoreaText}
          />
        </div>
      </div>
    </footer>
  );
}
