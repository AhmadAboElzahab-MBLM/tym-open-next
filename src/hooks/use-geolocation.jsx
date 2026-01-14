import { useState, useEffect } from 'react';

function useGeolocation() {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { latitude: '', longitude: '' },
  });
  const [error, setError] = useState('');

  const onSuccess = (_location) => {
    setLocation({
      loaded: true,
      coordinates: {
        latitude: _location.coords.latitude,
        longitude: _location.coords.longitude,
      },
    });
  };

  const onError = (_error) => {
    setError(_error.message);
  };

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return [location, error];
}

export default useGeolocation;
