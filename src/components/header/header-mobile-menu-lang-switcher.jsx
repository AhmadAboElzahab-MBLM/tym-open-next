import React, { useState } from 'react';
import Icons from '@/components/layout/icons';
import _ from 'lodash';
import { usePathname } from 'next/navigation';

function HeaderMobileMenuLangSwitcher() {
  const path = usePathname();
  const locale = path.split('/').filter(Boolean)[0];

  const [regionsMenu, setRegionsMenu] = useState(false);
  const regions = {
    en: 'International',
    ko: '한국',
    'en-ko': 'South Korea',
    'en-us': 'North America',
  };

  const handleRegionChange = (_region) => {
    const regionPais = _.toPairs(regions);
    const currentRegion = _.find(regionPais, (val) => val[0] === locale);
    const givenRegion = _.find(regionPais, (val) => val[0] === _region);
    setRegionsMenu(false);
    window.location.href = _.replace(path, currentRegion[0], givenRegion[0]);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="relative z-[51] flex h-20 w-full items-center gap-3 bg-primary p-7"
        onClick={() => setRegionsMenu((prev) => !prev)}>
        <Icons name="World" className="text-white" />
        <span className="h-fit font-noto text-[15px] font-normal text-white">
          {regions[locale]}
        </span>
      </button>

      <div
        className="absolute bottom-0 right-0 z-50 flex w-full translate-y-full flex-col gap-1
        bg-primary p-2
        transition-all duration-300 data-[open=true]:bottom-full data-[open=true]:translate-y-0"
        data-open={regionsMenu}>
        {_.map(
          regions,
          (val, key) =>
            key === locale || (
              <button
                type="button"
                key={key}
                className="flex h-auto w-full items-center bg-primary p-3 header-mobile-lang-switcher"
                onClick={() => handleRegionChange(key)}>
                <span className="h-fit font-noto text-[12px] font-normal text-white">{val}</span>
              </button>
            ),
        )}
      </div>
    </div>
  );
}

export default HeaderMobileMenuLangSwitcher;
