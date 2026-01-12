import React from 'react';
import BoxedContainer from '@/components/layout/boxed-container';
import TitleAndText from '@/components/layout/title-and-text';
import Link from 'next/link'
import _ from 'lodash';

function InnerPageHeader({ data, id }) {
  const title = _.get(data, 'properties.title.markup');
  const text = _.get(data, 'properties.text.markup');
  const link = _.get(data, 'properties.jumpToSectionLink');

  const handleSmoothScroll = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id={id} className="pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <TitleAndText title={title} text={text} className="max-w-[960px]" />
        {_.isEmpty(link) || (
          <Link 
            href={link[0]?.url} 
            onClick={(e) => handleSmoothScroll(e, link[0]?.url)} 
            className="inline-flex gap-2 items-center font-noto font-bold 
            text-clamp14to18 leading-1.77 text-cherry [&>span]:underline [&>span]:hover:no-underline">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
              <path d="M1 7.18052L7 13L13 7.18052" stroke="#C71619" strokeWidth="2"/>
              <path d="M7 11.3351L7 -2.77162e-05" stroke="#C71619" strokeWidth="2"/>
            </svg>
            <span>{link[0].title}</span>
          </Link>
        )}
      </BoxedContainer>
      
      </section>
  );
}

export default InnerPageHeader;
