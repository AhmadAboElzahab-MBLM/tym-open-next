import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import ItemsList from '../appplication-tractors-list/items-list';
import Gallery from './Gallery';
import IconsSet from '../IconsSet/IconsSet';
import JDItems from './JDItems';

export default function FirstTab({
  preOwnedProducts,
  firstTabTitle,
  firstTabSubTitle,
  galleryItems,
  galleryTitle,
  stepsTitle,
  stepsSubtitle,
  steps,
}) {
  const [currProduct, setCurrProduct] = useState({});
  const handleCurrProduct = useCallback((item, action) => {
    switch (action) {
      case 'add':
        setCurrProduct(item);
        break;
      case 'remove':
        setCurrProduct({});
        break;
      default:
        break;
    }
  }, []);

  return (
    <div className="flex flex-col space-y-12 lg:space-y-12">
      <section>
        {!_.isEmpty(firstTabTitle) && (
          <h2 className="mb-8 mt-12 text-center text-clamp18to28 font-bold lg:mt-20">
            {firstTabTitle}
          </h2>
        )}
        {!_.isEmpty(firstTabSubTitle) && (
          <p
            className="mb-6 text-center text-clamp16to18 lg:mb-12"
            dangerouslySetInnerHTML={{ __html: firstTabSubTitle }}
          />
        )}
        <div>
          <JDItems
            variant="JD"
            title="title"
            items={preOwnedProducts}
            currProduct={currProduct}
            handleClick={handleCurrProduct}
          />
        </div>
      </section>

      <section>
        {!_.isEmpty(galleryTitle) && (
          <h2 className="mb-8 text-center text-clamp18to28 font-bold lg:mb-12 lg:mt-20">
            {galleryTitle}
          </h2>
        )}
        <div>
          <Gallery data={galleryItems} />
        </div>
      </section>

      <section>
        {!_.isEmpty(stepsTitle) && (
          <h2 className="mb-5 text-center text-clamp18to28 font-bold lg:mt-20">{stepsTitle}</h2>
        )}
        {!_.isEmpty(stepsSubtitle) && (
          <p
            className="mb-6 text-center text-clamp16to18 lg:mb-12"
            dangerouslySetInnerHTML={{ __html: stepsSubtitle }}
          />
        )}
        <div>
          <IconsSet data={steps} />
        </div>
      </section>
    </div>
  );
}
