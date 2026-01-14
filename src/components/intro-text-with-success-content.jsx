import React, { Suspense, useContext, useEffect, useState } from 'react';
import Loading from '@/components/layout/loading';
import BoxedContainer from '@/components/layout/boxed-container';
import { motion } from 'framer-motion';
import _, { isEmpty, startCase } from 'lodash';
import { usePathname, useRouter } from 'next/navigation';
import removeLastSegment from '@/helpers/remove-last-segment';
import { isValidUniqueId } from '@/helpers/generate-unique-id';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

const formatDate = (date, lang) => {
  if (!_.isDate(date)) {
    throw new Error('Invalid date object');
  }

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // Check the language and set the locale accordingly
  const locale = lang === 'ko' ? 'ko-KR' : 'en-US';

  return new Intl.DateTimeFormat(locale, options).format(date);
};

function IntroTextWithSuccessContent({ id, data, lang }) {
  const { translations } = useContext(GlobalContext);
  const title = _.get(data, 'properties.title', '');
  const text1 = _.get(data, 'properties.text1.markup', '');
  const text2 = _.get(data, 'properties.text2.markup', '');
  const router = useRouter();
  const pathname = usePathname();
  const [requestNumber, setRequestNumber] = useState(null); // Track requestNumber
  const [requestData, setRequestData] = useState({});
  const [isClient, setIsClient] = useState(false); // Track if we are in the client

  const listFields1 = 
  (lang === 'en-ko' || lang === 'ko')
    ? [
        'lastname',
        'firstname',
        'address_1',
        'address_2',
        'city',
        'state_non_korea',
        'country',
        'select_state_province',
        'postal_zip_code',
        'zip',
        'email',
        'phone',
        'message',
      ]
    : [
        'firstname',
        'lastname',
        'address_1',
        'address_2',
        'city',
        'state_non_korea',
        'country',
        'select_state_province',
        'postal_zip_code',
        'zip',
        'email',
        'phone',
        'message',
      ];

  const listFields2 = ['dealership_name'];

  const fieldMapping = {
    Firstname: "First Name",
    Lastname: "Last Name",
    "Postal Zip Code": "Zip Code",
    "Select State Province": (lang === "en-ko" || lang === "ko") ? "Province" : "State",
  };

  // Set `isClient` to true only after the component mounts in the browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch request number from URL and set it
  useEffect(() => {
    if (isClient) {
      const params = new URLSearchParams(window.location.search);
      setRequestNumber(params.get('request_number'));
    }
  }, [isClient]);

  // Fetch data from sessionStorage and handle redirects on client-side only
  useEffect(() => {
    if (isClient && requestNumber) {
      const validUniqId = isValidUniqueId(requestNumber);
      const targetUrl = removeLastSegment(pathname);

      if (validUniqId) {
        const localData = sessionStorage.getItem(requestNumber);
        if (localData) {
          setRequestData(JSON.parse(localData));
        } else {
          router.push(targetUrl);
        }
      }
    }
  }, [requestNumber, pathname, router, isClient]);

  // Clear session storage on component unmount
  useEffect(() => () => {
      if (isClient) sessionStorage.clear();
    }, [isClient]);

  if (!isClient || isEmpty(requestData)) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <section
        id={id}
        className="relative overflow-hidden bg-white pt-[90px] 
        md:pt-[120px] lg:pt-[200px] xl:pt-[284px]"
      >
        <BoxedContainer className="relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex max-w-[864px] flex-col gap-y-[15px] md:gap-y-[20px] lg:gap-y-[32px]"
          >
            <div
              className="text-clamp24to48 font-bold uppercase leading-1.42 text-primary"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <div
              className="font-noto text-clamp14to18 font-normal leading-1.77 text-black"
              dangerouslySetInnerHTML={{ __html: text1 }}
            />
            {!isEmpty(requestData) && (
              <div
                className="flex w-full items-center justify-between 
                bg-porcelain px-4 py-2 text-clamp14to18"
              >
                <span className="font-bold">
                  {`${getTranslationByKey('Your Request Number', translations, lang)}: ${requestNumber}`}
                </span>
                <span>{formatDate(new Date(), lang)}</span>
              </div>
            )}
            <div
              className="font-noto text-clamp14to18 font-normal leading-1.77 text-black"
              dangerouslySetInnerHTML={{ __html: text2 }}
            />
            {!isEmpty(requestData) && (
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-3">
                  <div className="text-clamp14to18 font-bold leading-1.77 text-black">
                    <span className="font-bold after:inline after:content-[':']">
                      {getTranslationByKey('Requested by', translations, lang)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    {listFields1.map((field) => {
                    const displayName = fieldMapping[startCase(field)] || startCase(field);
                    
                    return requestData[field] ? (
                      <div key={field} className="flex gap-x-2">
                        <span className="font-bold after:inline after:content-[':']">
                          {getTranslationByKey(displayName, translations, lang)}
                        </span>
                        <span>{requestData[field]}</span>
                      </div>
                    ) : null;
                  })}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="text-clamp14to18 font-bold leading-1.77 text-black">
                    <span className="after:inline after:content-[':']">
                      {getTranslationByKey('Selected Dealership contact', translations, lang)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    {listFields2.map(
                      (field) =>
                        requestData[field] && (
                          <div key={field} className="flex gap-x-2">
                            <span className="font-bold after:inline after:content-[':']">
                            {getTranslationByKey("Dealer", translations, lang)}
                            </span>
                            <span>{requestData[field]}</span>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </BoxedContainer>
      </section>
    </Suspense>
  );
}

export default IntroTextWithSuccessContent;
