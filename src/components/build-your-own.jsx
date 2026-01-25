import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSearchParamsWrapper } from '@/hooks/useSearchParamsWrapper';
import axios from 'axios';
import _ from 'lodash';

export default function BuildYourOwn() {
  const router = useRouter();
  const paths = usePathname();
  const [region, setRegion] = useState(paths.split('/')[1] || 'en');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuildYourOwnContent region={region} setRegion={setRegion} />
    </Suspense>
  );
}

function BuildYourOwnContent({ region, setRegion }) {
  const { model, force, configure } = useSearchParamsWrapper();
  const router = useRouter();
  const loadScript = (src) => {
    // Check if the script with the given src is already in the DOM
    const existingScript = document.querySelector(`script[src="${src}"]`);

    // If the script doesn't exist, load it
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    } else {
      console.log(`Script already exists: ${src}`);
    }
  };

  const loadCssFile = (url) => {
    // Check if the CSS file is already loaded
    const existingLink = Array.from(document.styleSheets).find(
      (sheet) => sheet.href && sheet.href.includes(url),
    );

    // If the CSS file is not loaded, create a new link element
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;

      // Append the link to the head of the document
      document.head.appendChild(link);

      console.log(`CSS file loaded: ${url}`);
    } else {
      console.log(`CSS file already loaded: ${url}`);
    }
  };

  const capitalizeFirstLetter = async (obj) => {
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        return Promise.all(obj.map(async (item) => await capitalizeFirstLetter(item)));
      }
      const newObj = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
          newObj[capitalizedKey] = await capitalizeFirstLetter(obj[key]);
        }
      }
      return newObj;
    }
    return obj;
  };

  const fixServerData = async (data, reg) => {
    const r = reg == 'ko' || reg == 'en-ko' ? 'South Korea' : 'International';
    const regionsArr = ['North America', 'International', 'South Korea', 'Deutschland'];
    const item = data;

    const prop = item.properties;
    prop.id = item.id;
    prop.name = item.name;
    prop.contentType = item.contentType;
    prop.type = prop.category;
    prop.node = item.name;
    prop.hasChildren = false;
    prop.AvailableInRegions = prop.excludedRegions
      ? regionsArr.filter((item) => !prop.excludedRegions.includes(item))
      : regionsArr;
    prop.HasAddons = !!(prop.addOns && prop.addOns.items && prop.addOns.items.length);
    prop.Prices = [
      {
        International: '',
      },
      {
        'North America': '',
      },
      {
        'South Korea': '',
      },
    ];

    prop.Content = {};
    prop.Content[r] = {
      SalesDescription: prop.salesDescription,
      Series: prop.series,
      Category: prop.category,
      USPs: prop.uspItems && prop.uspItems.items ? prop.uspItems.items : [],
      ModelDescriptorForPOSOnly: prop.modelDescriptorForPOSOnly,
      FeaturedSpecs:
        prop.specifications && prop.specifications.items
          ? prop.specifications.items.filter((spec) => spec.content.properties.featured === true)
          : [],
    };

    const capitalizedData = await capitalizeFirstLetter(prop);
    return capitalizedData;
  };

  const fixAddonData = async (baseArr, serverResp) => {
    const filteredArr = serverResp.filter((obj1) =>
      baseArr.some(
        (obj2) =>
          obj2.Content.Properties.Product &&
          obj2.Content.Properties.Product.Id &&
          obj1.id === obj2.Content.Properties.Product.Id,
      ),
    );
    const newDataArr = [];
    const regionsArr = ['North America', 'International', 'South Korea'];

    for (const i of filteredArr) {
      const item = baseArr.filter(
        (el) =>
          el.Content.Properties.Product &&
          el.Content.Properties.Product.Id &&
          el.Content.Properties.Product.Id === i.id,
      )[0];
      const prop = i.properties;
      prop.IsDefault = item.Content.Properties.IsDefault;
      prop.IsStandard = item.Content.Properties.IsStandard;
      prop.Exclusions = item.Content.Properties.Exclusions;
      prop.Required = item.Content.Properties.RequiredProduct;
      prop.id = i.id;
      prop.name = i.name;
      prop.contentType = i.contentType;
      prop.type = i.contentType === 'product' ? prop.category : prop.type;
      prop.subCategory = i.contentType === 'product' ? prop.subCategory : prop.type;
      prop.node = i.name;
      prop.hasChildren = false;
      prop.AvailableInRegions = prop.excludedRegions
        ? regionsArr.filter((item) => !prop.excludedRegions.includes(item))
        : [];
      prop.HasAddons = !!(prop.addOns && prop.addOns.items && prop.addOns.items.length);
      prop.Prices = [
        {
          International: '',
        },
        {
          'North America': '',
        },
        {
          'South Korea': '',
        },
      ];

      newDataArr.push(prop);
    }

    const capitalizedData = await capitalizeFirstLetter(newDataArr);
    return capitalizedData;
  };

  const setNewHeight = () => {
    const nHeight = `${window.innerHeight * 0.9}px`;
    document.documentElement.setAttribute('style', `--app-height: ${nHeight}`);
  };

  const fetchData = async () => {
    console.log('region', region);
    try {
      const currRegion = region === 'en' ? 'en-us' : region;
      const baseUmbracoUrl = process.env.NEXT_PUBLIC_UMBRACO_ENDPOINT;
      const productResponse = await axios.get(
        `${baseUmbracoUrl}?take=300&filter=contentType:product`,
        {
          headers: {
            'API-Key': 'UwKztYrqcVHdJredejwWHxnRAyzha9Pn',
            'Accept-Language': currRegion,
          },
        },
      );

      // console.log(region, productResponse);

      const modelObj = productResponse.data.items.filter((el) => {
        if (_.toLower(_.get(el, 'name', '')) === _.toLower(model)) return el;
      })[0];

      // console.log('modelObj', modelObj);

      if (modelObj) {
        const dataSource = await fixServerData(modelObj, currRegion);
        const useConfiguratorDefault = !!(configure && !dataSource.UseThreeSixtyModel);

        if (window.startPage) {
          window.startPage(modelObj.name, useConfiguratorDefault, region);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    setRegion((prevRegion) => (prevRegion === 'en-ko' ? 'ko' : prevRegion));
  }, [model]);

  useEffect(() => {
    if (model) {
      fetchData();
    }
  }, [model, region, router, force]);

  useEffect(() => {
    if (region === 'en-us') {
      window.__ss_noform = window.__ss_noform || [];
      window.__ss_noform.push([
        'baseURI',
        'https://app-3S6NRITHG4.marketingautomation.services/webforms/receivePostback/MzY0tLQwMTSyAAA/',
      ]);
      window.__ss_noform.push(['endpoint', '619bf577-8867-4b85-9015-f5700d2321cf']);
      loadScript('https://koi-3S6NRITHG4.marketingautomation.services/client/noform.js?ver=1.24');
    }

    // loadScript('/scripts/common/jquery-3.5.1.min.js');
    // loadScript('https://cdnjs.cloudflare.com/ajax/libs/iScroll/5.2.0/iscroll.min.js');
    // loadScript('/scripts/jobsite.js');
    // loadScript('https://d2q0dg49mzo6xk.cloudfront.net/webplayer/beta-webassembly-new/posweb.js');
    if (window.location.href.includes('staging.')) {
      loadScript(
        'https://d2q0dg49mzo6xk.cloudfront.net/webplayer/react-staging/static/js/pos_web.js',
      );
      loadCssFile(
        'https://d2q0dg49mzo6xk.cloudfront.net/webplayer/react-staging/static/css/pos_web.css',
      );
    } else {
      loadScript('https://d2q0dg49mzo6xk.cloudfront.net/webplayer/react-dev/static/js/pos_web.js');
      loadCssFile('https://d2q0dg49mzo6xk.cloudfront.net/webplayer/react-dev/static/css/pos_web.css');
    }
  }, [region]);

  return (
    <main className="main build-your-own h-[100vh]">
      <div id="posweb-player" />
    </main>
  );
}
