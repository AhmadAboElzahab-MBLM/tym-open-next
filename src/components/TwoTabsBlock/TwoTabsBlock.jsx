'use client';
import React, { useState, useContext } from 'react';
import { get } from 'lodash';
import { motion } from 'framer-motion';
import BoxedContainer from '../layout/boxed-container';
import Toggles from '../ViewGalleryBlock/Toggles';
import FirstTab from './FirstTab';
import SecondTab from './SecondTab';
import GlobalContext from '@/context/global-context';

export default function TwoTabsBlock({ data }) {
  const { preOwnedProducts } = useContext(GlobalContext);

  const secondLabel = get(data, 'properties.SecondTabLabel', '');
  const firstLabel = get(data, 'properties.FirstTabLabel', '');

  const firstTabSubTitle = get(data, 'properties.FirstTabSubTitle.markup', '');
  const firstTabTitle = get(data, 'properties.FirstTabTitle', '');

  const SecondTabSubtitle = get(data, 'properties.SecondTabSubtitle.markup', '');
  const SecondTabTitle = get(data, 'properties.SecondTabTitle', '');

  const galleryTitle = get(data, 'properties.galleryTitle', '');
  const galleryItems = get(data, 'properties.galleryItems', []);

  const table = get(data, 'properties.content', null);

  const steps = get(data, 'properties.steps', []);

  const sellingSteps = get(data, 'properties.SellingSteps', []);
  const stepsTitle = get(data, 'properties.stepsTitle', '');
  const stepsSubtitle = get(data, 'properties.stepsSubtitle', '');

  const [selected, setSelected] = useState(firstLabel);

  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <section className="pt-15 md:pt-20">
      <BoxedContainer>
        <div className="mx-auto w-fit">
          <Toggles
            selected={selected}
            setSelected={setSelected}
            firstLabel={firstLabel}
            secondLabel={secondLabel}
          />
        </div>

        {selected === firstLabel ? (
          <motion.div
            key="firstTab"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}>
            <FirstTab
              steps={steps}
              stepsTitle={stepsTitle}
              stepsSubtitle={stepsSubtitle}
              galleryItems={galleryItems}
              galleryTitle={galleryTitle}
              preOwnedProducts={preOwnedProducts}
              firstTabTitle={firstTabTitle}
              firstTabSubTitle={firstTabSubTitle}
            />
          </motion.div>
        ) : (
          <motion.div
            key="secondTab"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}>
            <SecondTab
              secondTabTitle={SecondTabTitle}
              sellingSteps={sellingSteps}
              secondTabSubtitle={SecondTabSubtitle}
              table={table}
            />
          </motion.div>
        )}
      </BoxedContainer>
    </section>
  );
}
