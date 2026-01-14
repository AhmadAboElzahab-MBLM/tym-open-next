import React from 'react';
import _ from 'lodash';
import Icons from '@/components/layout/icons';

function QuizItem({ item, selected, setSelected }) {
  const questionTitle = item?.content?.properties?.questionTitle || '';
  const questionText = item?.content?.properties?.questionText || '';
  const answers = item?.content?.properties?.questionAnswer || [];

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <span className="font-noto text-clamp14to15 font-bold leading-1.5">{questionTitle}</span>
        <span className="font-noto text-clamp14to15 leading-1.5">{questionText}</span>
      </div>
      <div className="flex flex-col gap-y-4">
        {_.map(answers, (val, ind) => (
          <button
            key={ind}
            type="button"
            className="flex flex-nowrap gap-x-4 text-left quiz-prev-button"
            onClick={() =>
              setSelected((prev) => ({
                ...prev,
                [_.snakeCase(questionTitle)]: prev[_.snakeCase(questionTitle)] === val ? '' : val,
              }))
            }>
            <div className="my-auto h-5 w-5">
              <Icons
                name="Unchecked"
                data-selected={_.isEqual(selected[_.snakeCase(questionTitle)], val)}
                className="h-5 w-5 data-[selected=true]:bg-cherry"
              />
            </div>
            <span className="font-noto text-clamp14to15">{val}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizItem;
