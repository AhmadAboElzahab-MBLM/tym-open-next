import React from 'react';
import _ from 'lodash';
import Loading from '@/components/layout/loading';
import SuccessStoriesHomeSlider from './success-stories-home-slider';
import SuccessStoriesInnerSlider from './success-stories-inner-slider';

export default function SuccessStoriesSlider({ id, data, region, locale, lang, customerStory }) {
  const headline = _.get(data, 'properties.headline', 'STORIES FROM THE FIELD');
  const image = _.get(data, 'properties.image', [
    { url: 'https://tym-new.euwest01.umbraco.io/media/2tjhemkp/success-stories-placeholder.png' },
  ]);
  const link = _.get(data, 'properties.link', null);
  const variant = _.get(data, 'properties.variant', '');

  if (_.isEmpty(customerStory)) return <Loading />;
  if (variant === 'Inner Page') {
    return (
      <SuccessStoriesInnerSlider
        headline={headline}
        customerStory={customerStory}
        image={image}
        link={link}
      />
    );
  }

  return (
    <SuccessStoriesHomeSlider
      headline={headline}
      customerStory={customerStory}
      image={image}
      link={link}
      data={data}
    />
  );
}
