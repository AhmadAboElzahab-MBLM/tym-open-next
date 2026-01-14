import React from 'react';

const styleVariants = {
  default: 'container mx-auto relative max-w-[70rem] xl:px-0 px-4',
  lg: 'container mx-auto relative max-w-[95rem] 4xl:px-0 px-4',
  'header-menu': 'container mx-auto relative max-w-[87.5rem] 4xl:px-0 px-4',
  sm: 'container mx-auto relative max-w-[60rem] 4xl:px-0 px-4',
};

export default function BoxedContainer({ children, className = '', variant = 'default' }) {
  const classnames = `${styleVariants[variant]} ${className}`;
  return <div className={classnames}>{children}</div>;
}
