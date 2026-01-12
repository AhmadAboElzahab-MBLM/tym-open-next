'use client';

import Link from 'next/link';
import React, { useContext } from 'react';
import GlobalContext from '@/context/global-context';
import _ from 'lodash';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Icons from './layout/icons';

export default function AsideMenu({ data }) {
  const phone = _.get(data, 'properties.phone', null);
  const email = _.get(data, 'properties.email', null);
  const pathname = usePathname();
  const lastSegment = _.last(_.split(pathname, '/'));
  const { lang } = useContext(GlobalContext);

  if (_.isEqual(lastSegment, 'build-your-own')) return null;
  if (lang === 'en') return null;

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      viewport={{ once: true }}
      className="fixed right-0 top-[calc(50%-160px)] z-[50] flex
      h-auto flex-col items-end 4xl:top-[460px]">
      <div className="hidden flex-col items-end md:flex">
        {lang !== 'en-us' && phone && (
          <Link
            href={`tel:${phone}`}
            className="aside-menu-phone aside-menu-item-ko group flex w-[50px] items-center gap-5 bg-black bg-opacity-60 px-[15px] py-[15px] transition-all duration-500 ease-in-out">
            <Icons name="Phone" className="h-fit min-w-[22px]" />
            <span className="transform whitespace-nowrap font-noto text-[15px]  text-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
              {lang === 'ko' ? '고객 케어 센터' : 'Customer Care Center'}
            </span>
          </Link>
        )}

        {lang !== 'en-us' && email && (
          <Link
            href={`/${lang}/about/contact`}
            className="aside-menu-email aside-menu-item-ko group flex w-[50px] items-center gap-5 bg-black bg-opacity-60 px-[15px] py-[15px] transition-all duration-500 ease-in-out">
            <Icons name="Mail" className="h-fit min-w-[22px]" />
            <span className="transform whitespace-nowrap font-noto text-[15px]  text-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
              {lang === 'ko' ? '문의 ' : 'Contact TYM'}
            </span>
          </Link>
        )}
        {lang == 'en-us' && (
          <Link
            href={`/${lang}/find-a-dealer`}
            className="aside-menu-email aside-menu-item group flex w-[50px] items-center gap-5 bg-black bg-opacity-60 px-[15px] py-[15px] transition-all duration-500 ease-in-out">
            <Icons name="Location" className="h-[18px] min-w-[22px]" />
            <span className="transform whitespace-nowrap font-noto text-[15px]  text-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
              Find a Dealer
            </span>
          </Link>
        )}
        {lang == 'en-us' && (
          <Link
            href={`/${lang}/products/request-quote`}
            className="aside-menu-cart aside-menu-item group flex w-[50px] items-center gap-5 bg-black bg-opacity-60 px-[15px] py-[15px] transition-all duration-500 ease-in-out">
            <Icons name="Cart" className="h-[18px] min-w-[22px]" />
            <span className="transform whitespace-nowrap font-noto text-[15px]  text-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
              Request a Quote
            </span>
          </Link>
        )}
        {lang == 'en-us' && (
          <Link
            href={`/${lang}/about/contact`}
            className="aside-menu-location aside-menu-item group flex w-[50px] items-center gap-5 bg-black bg-opacity-60 px-[15px] py-[15px] transition-all duration-500 ease-in-out">
            <Icons name="Mail" className="h-[18px] min-w-[22px]" />
            <span className="transform whitespace-nowrap font-noto text-[15px]  text-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
              Contact TYM
            </span>
          </Link>
        )}
        {lang == 'en-us' && (
          <button
            type="button"
            className="aside-menu-location aside-menu-item group flex w-[50px] items-center gap-5 bg-black bg-opacity-60 px-[15px] py-[15px] transition-all duration-500 ease-in-out">
            <Icons name="Mercendise" className="h-[23px] min-w-[22px]" />
            <Link
              href="https://gear.tym.world/"
              target="_blank"
              className="transform whitespace-nowrap font-noto text-[15px]  text-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
              TYM Merchandise
            </Link>
          </button>
        )}
      </div>
      <div className="flex flex-col items-end md:hidden">
        {lang !== 'en-us' && phone && (
          <button
            type="button"
            className="aside-menu-phone aside-menu-item-ko group flex w-[50px] items-center gap-5 bg-black bg-opacity-60 px-[15px] py-[15px] transition-all duration-500 ease-in-out">
            <Icons name="Phone" className="h-fit min-w-[22px]" />
            <Link
              href={`tel:${phone}`}
              className="transform whitespace-nowrap font-noto text-[15px]  text-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
              {lang === 'ko' ? '고객 케어 센터' : 'Customer Care Center'}
            </Link>
          </button>
        )}

        {lang !== 'en-us' && email && (
          <button
            type="button"
            className="aside-menu-email aside-menu-item-ko group flex w-[50px] items-center gap-5 bg-black bg-opacity-60 px-[15px] py-[15px] transition-all duration-500 ease-in-out">
            <Icons name="Mail" className="h-fit min-w-[22px]" />
            <Link
              href={`/${lang}/about/contact`}
              className="transform whitespace-nowrap font-noto text-[15px]  text-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
              {lang === 'ko' ? '문의 ' : 'Contact TYM'}
            </Link>
          </button>
        )}
        {lang == 'en-us' && (
          <button
            type="button"
            className="aside-menu-email aside-menu-item group flex w-[50px] items-center gap-5 bg-black bg-opacity-60 px-[15px] py-[15px] transition-all duration-500 ease-in-out">
            <Icons name="Location" className="h-[18px] min-w-[22px]" />
            <Link
              href={`/${lang}/find-a-dealer`}
              className="transform whitespace-nowrap font-noto text-[15px]  text-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
              Find a Dealer
            </Link>
          </button>
        )}
        {lang == 'en-us' && (
          <button
            type="button"
            className="aside-menu-cart aside-menu-item group flex w-[50px] items-center gap-5 bg-black bg-opacity-60 px-[15px] py-[15px] transition-all duration-500 ease-in-out">
            <Icons name="Cart" className="h-[18px] min-w-[22px]" />
            <Link
              href={`/${lang}/products/request-quote`}
              className="transform whitespace-nowrap font-noto text-[15px]  text-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
              Request a Quote
            </Link>
          </button>
        )}
        {lang == 'en-us' && (
          <button
            type="button"
            className="aside-menu-location aside-menu-item group flex w-[50px] items-center gap-5 bg-black bg-opacity-60 px-[15px] py-[15px] transition-all duration-500 ease-in-out">
            <Icons name="Mail" className="h-[18px] min-w-[22px]" />
            <Link
              href={`/${lang}/about/contact`}
              className="transform whitespace-nowrap font-noto text-[15px]  text-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
              Contact TYM
            </Link>
          </button>
        )}
        {lang == 'en-us' && (
          <button
            type="button"
            className="aside-menu-location aside-menu-item group flex w-[50px] items-center gap-5 bg-black bg-opacity-60 px-[15px] py-[15px] transition-all duration-500 ease-in-out">
            <Icons name="Mercendise" className="h-[18px] min-w-[22px]" />
            <Link
              href="https://gear.tym.world/"
              target="_blank"
              className="transform whitespace-nowrap font-noto text-[15px]  text-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100">
              TYM Merchandise
            </Link>
          </button>
        )}
      </div>
    </motion.aside>
  );
}

