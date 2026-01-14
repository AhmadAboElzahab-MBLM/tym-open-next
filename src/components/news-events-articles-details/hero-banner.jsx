import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import BoxedContainer from '@/components/layout/boxed-container';
import Image from 'next/image';
import _ from 'lodash';
import Icons from '@/components/layout/icons';
import removeLastSegment from '@/helpers/remove-last-segment';
import { getTranslationByKey } from '@/utils/translation-helper';
import handleKoEnDate from '@/helpers/handle-ko-en-date';
import GlobalContext from '@/context/global-context';
import { usePathname, useRouter } from 'next/navigation';

function HeroBanner(props) {
  const title = _.get(props, 'title', null);
  const text = _.get(props, 'text', null);
  const image = _.get(props, 'image', null);
  const heroImages = _.get(props, 'heroImages', null);
  const date = _.get(props, 'date', null);
  const productType = _.get(props, 'productType', null);
  const type = _.get(props, 'type', null);
  const tractorModel = _.get(props, 'tractorModel', null);
  const series = _.get(props, 'series', null);
  const backButton = _.get(props, 'backButton', null);
  const router = useRouter();
  const pathname = usePathname();
  const { translations, lang } = useContext(GlobalContext);

  const handleReturnPath = () => {
    const howToPath = 'all-how-tos-checklists';
    const successStories = 'customer-stories';

    if (pathname.includes(howToPath)) {
      return _.replace(pathname, howToPath, 'parts-support/how-tos-checklists');
    }
    if (pathname.includes(successStories)) {
      return _.replace(pathname, successStories, 'products/success-stories');
    }
    return pathname;
  };

  const newPath = removeLastSegment(handleReturnPath());

  const handleReturn = () => {
    router.push(newPath);
  };
  const successStories = pathname.includes('customer-stories');

  return (
    <>
      <BoxedContainer variant="sm">
        <motion.div
          className="flex max-w-[832px] flex-col gap-y-5 py-6 pt-[90px] md:pt-[120px]
          lg:gap-y-8 lg:pb-10 lg:pt-[200px] xl:pt-[284px]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          viewport={{ once: true }}>
          <motion.button
            type="button"
            onClick={handleReturn}
            className="news-details-back-button flex items-center gap-[17px] font-noto text-clamp12to15
            font-bold leading-1.125 text-primary"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            viewport={{ once: true }}>
            <Icons name={backButton.icon} className="scale-[-1] stroke-primary stroke-2" />
            <span>{getTranslationByKey(backButton.label, translations, lang)}</span>
          </motion.button>
          {_.isEmpty(title) || (
            <motion.div
              className="text-clamp24to48 font-bold uppercase leading-1.125"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              viewport={{ once: true }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-row flex-wrap items-center gap-2 pt-2">
            {_.isEmpty(type) ? (
              _.isEmpty(productType) || (
                <div
                  className="min-h-10 inline-flex items-center justify-center
                whitespace-pre border-none bg-cherry px-4 py-[10px] font-noto
                text-clamp14to15 font-bold uppercase not-italic leading-1.625 tracking-[1.5px]
                text-white transition-all duration-300 ease-in-out">
                  {getTranslationByKey(productType, translations, lang)}
                </div>
              )
            ) : (
              <div
                className="min-h-10 inline-flex items-center justify-center
                whitespace-pre border-none bg-cherry px-4 py-[10px] font-noto
                text-clamp14to15 font-bold uppercase not-italic leading-1.625 tracking-[1.5px]
                text-white transition-all duration-300 ease-in-out">
                {type === 'Event'
                  ? getTranslationByKey('Exhibition', translations, lang)
                  : getTranslationByKey(type, translations, lang)}
              </div>
            )}

            {_.isEmpty(series) || (
              <div
                className="min-h-10 inline-flex items-center justify-center
                whitespace-pre border-none bg-cherry px-4 py-[10px] font-noto
                text-clamp14to15 font-bold uppercase not-italic leading-1.625 tracking-[1.5px]
                text-white transition-all duration-300 ease-in-out">
                {getTranslationByKey(series, translations, lang)}
              </div>
            )}
            {_.isEmpty(tractorModel) || (
              <div
                className="min-h-10 inline-flex items-center justify-center
                whitespace-pre border-none bg-cherry px-4 py-[10px] font-noto
                text-clamp14to15 font-bold uppercase not-italic leading-1.625 tracking-[1.5px]
                text-white transition-all duration-300 ease-in-out">
                {getTranslationByKey(tractorModel, translations, lang)}
              </div>
            )}

            <span
              className="kr-text pl-4 font-noto text-clamp12to15 font-bold uppercase
            leading-1.75 tracking-[1px] lg:pl-8 lg:tracking-[1.5px]">
              {handleKoEnDate(date, lang)}
            </span>
          </motion.div>
          {_.isEmpty(text) || (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              viewport={{ once: true }}
              className="kr-text pt-2 font-noto text-clamp14to18
              leading-1.77 a-child:font-noto a-child:text-clamp14to15 a-child:font-bold
              a-child:text-chiliPepper a-child:underline ul-child:ml-3 ul-child:flex
              ul-child:flex-col ul-child:gap-1 li-child:text-clamp16to18 li-child:text-cherry
              before:li-child:absolute before:li-child:-ml-3 before:li-child:inline
              before:li-child:content-bullet"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </motion.div>
      </BoxedContainer>
      <BoxedContainer variant="lg">
        {successStories ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            viewport={{ once: true }}
            className="w-full pb-2">
            {_.isEmpty(heroImages) || (
              <Image
                src={heroImages.url}
                alt={heroImages.alt}
                fill
                loading="lazy"
                className="!relative !max-h-[48rem] lg:!min-h-[16rem] !object-cover !aspect-video"
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            viewport={{ once: true }}
            className="w-full pb-2">
            {_.isEmpty(image) || (
              <Image
                src={image.url}
                alt={image.alt}
                fill
                loading="lazy"
                className="!relative !max-h-[48rem] lg:!min-h-[16rem] !object-contain !aspect-video"
              />
            )}
          </motion.div>
        )}
      </BoxedContainer>
    </>
  );
}

export default HeroBanner;

