import { useState, useEffect } from 'react';
import { get, isError } from 'lodash';

export function useFetchSpecificData(contentType, region, locale, lang) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      const res = await fetch('/api/specific-data', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ contentType, region, locale, lang }),
      });

      if (!res.ok) throw new Error(`Network response was not ok. Status: ${res.status}`);

      const resp = await res.json();
      setData(get(resp, 'data', []));
    } catch (err) {
      if (isError(err)) setError(err);
      else {
        console.error('Unexpected error:', err);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [contentType, region, locale, lang]);

  return [data, error];
}
