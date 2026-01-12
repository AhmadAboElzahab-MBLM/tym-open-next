import React from 'react';

export default function useSearchChange() {
  const isBrowser = typeof window !== 'undefined';
  const initSearch = isBrowser ? window.location.search : '';
  const [searchParams, setSearchParams] = React.useState(initSearch);

  React.useEffect(() => {
    setSearchParams(window.location.search);
  }, [initSearch]);

  const result = searchParams.slice(1);

  return { searchParams: result };
}
