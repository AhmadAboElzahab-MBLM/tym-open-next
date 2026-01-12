import React from 'react';
import _ from 'lodash';
import HeroBanner from '@/components/news-events-articles-details/hero-banner';
import components from '@/components';

function NewsEventsArticlesDetails({
  title,
  text,
  image,
  date,
  blocks,
  backButton,
  htmlContent,
  heroImages,
  productType,
  type,
  tractorModel,
  series,
  region,
  locale,
  lang,
  isSuccessStories,
}) {
  return (
    <section
      className={`pb-[60px] lg:pb-[160px] ${isSuccessStories ? 'success-stories-body' : ''}`}>
      <HeroBanner
        title={title}
        text={text}
        image={image}
        date={date}
        backButton={backButton}
        productType={productType}
        type={type}
        tractorModel={tractorModel}
        series={series}
        heroImages={heroImages}
        isSuccessStories
      />
      {_.isEmpty(blocks) ||
        _.map(blocks.items, (item, index) => {
          if (_.isEmpty(item)) return null;
          const type = _.get(item, 'content.contentType');
          const blockProps = _.get(item, 'content');
          const Comp = components[_.upperFirst(type)];
          const id = `${type}_${index + 1}`;
          return (
            _.isFunction(Comp) && (
              <Comp
                key={id}
                id={id}
                data={blockProps}
                region={region}
                locale={locale}
                lang={lang}
              />
            )
          );
        })}
    </section>
  );
}

export default NewsEventsArticlesDetails;
