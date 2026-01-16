import React from 'react';
import icons from '@/assets/svg';
import _ from 'lodash';

export default function Icons({ name, className, ...rest }) {
  const COMP = _.get(icons, name, null);
  if (!COMP || typeof COMP !== 'function') return null;
  return <COMP className={className} {...rest} />;
}
