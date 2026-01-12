import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { get, toLower, head, slice, forEach, set, isEmpty } from 'lodash';
import GridView from '@/components/technical-specification/grid-view';
import BoxedContainer from '../layout/boxed-container';
import TitleSection from '../layout/title-section';
import Icons from '../layout/icons';
import ListView from './list-view';
import Loading from '../layout/loading';

export default function TechnicalSpecification({ data, products }) {
  const comparedMachines = get(data, 'properties.comparedMachines', []);
  const specificationTitle = get(data, 'properties.specificationTitle', '');
  const [viewMode, setViewMode] = useState('grid');

  const handleViewChange = (mode) => setViewMode(mode);

  if (isEmpty(products)) return <Loading />;

  return (
    <section
      id="specs"
      className="pb-10 pt-[60px] md:pt-[80px] lg:pb-[60px] lg:pt-[100px] xl:pb-[80px]">
      <BoxedContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}>
          <div className="flex flex-row justify-between gap-x-[40px]">
            <TitleSection data={specificationTitle} />
            <div className="flex flex-row gap-x-[12px]">
              <button
                type="button"
                onClick={() => handleViewChange('grid')}
                className={
                  viewMode === 'grid'
                    ? 'hidden svg-child:opacity-[1] lg:block'
                    : 'hidden svg-child:opacity-[0.5] lg:block'
                }>
                <Icons name="Grid" className="h-[20px] w-[20px]" />
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('list')}
                className={
                  viewMode === 'list'
                    ? 'svg-child:opacity-[1]'
                    : 'hidden svg-child:opacity-[0.5] lg:block'
                }>
                <Icons name="List" className="h-[20px] w-[20px]" />
              </button>
            </div>
          </div>
          <div className="w-full">
            <div className="overflow-x-auto">
              <div className="min-w-[768px]">
                {(() => {
                  const isParent = get(data, 'properties.isParent', false);
                  const sideImage = get(data, 'properties.navigationSideImage', []);

                  forEach(comparedMachines, (item) => {
                    if (isParent) {
                      set(item, 'properties.navigationSideImage', sideImage);
                    }
                  });

                  const currData = isParent ? head(comparedMachines) : data;
                  const currComparedMachines = isParent
                    ? slice(comparedMachines, 0)
                    : comparedMachines;
                  const currComparedMachinesJohnSeries = isParent
                    ? slice(comparedMachines, 1)
                    : comparedMachines;

                  const name = get(data, 'name', '');
                  const shouldUseCurrData =
                    name === 'John Deere R Series' || name === 'John Deere M Series';

                  const dataToUse = shouldUseCurrData ? currData : data;
                  const newComparedMachines = shouldUseCurrData
                    ? currComparedMachinesJohnSeries
                    : currComparedMachines;

                  switch (toLower(viewMode)) {
                    case 'grid':
                      return (
                        <GridView
                          isParent={isParent}
                          data={dataToUse}
                          compareMachinesData={newComparedMachines}
                        />
                      );
                    case 'list':
                      return (
                        <ListView
                          isParent={isParent}
                          data={dataToUse}
                          compareMachinesData={newComparedMachines}
                        />
                      );
                    default:
                      return null;
                  }
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      </BoxedContainer>
    </section>
  );
}
