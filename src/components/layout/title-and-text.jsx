import React, { useEffect } from 'react';

function TitleAndText({ title, text, className }) {
  // useEffect(() => {
  //   const anchorTag = document.querySelector('#pick-my-tractor-btn');

  //   if (anchorTag) {
  //     anchorTag.click();
  //   }
  // }, []);

  return (
    <div className={`flex flex-col gap-y-3 pb-4 lg:gap-y-8 lg:pb-6 ${className}`}>
      {title && (
        <div
          className="text-clamp24to48 font-bold uppercase leading-1.125"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}
      {text && (
        <div
          className="font-noto text-clamp14to18 leading-1.77
          a-child:font-noto a-child:text-clamp14to18 a-child:font-bold a-child:text-chiliPepper
          a-child:underline md:leading-1.75"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
    </div>
  );
}

export default TitleAndText;
