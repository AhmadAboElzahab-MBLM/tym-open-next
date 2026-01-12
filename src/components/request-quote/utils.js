import _ from 'lodash';

// Helper function to get coordinates from zip code using Google Geocoding API
export const getCoordinatesFromZipCode = async (zipCode) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      }`,
    );
    const geocodeData = await response.json();

    if (geocodeData.results && geocodeData.results.length > 0) {
      const { location } = geocodeData.results[0].geometry;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding zip code:', error);
    return null;
  }
};

// Enhanced function to get full location data from zip code
export const getLocationDataFromZipCode = async (zipCode) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      }`,
    );
    const geocodeData = await response.json();

    if (geocodeData.results && geocodeData.results.length > 0) {
      const result = geocodeData.results[0];
      const components = result.address_components;

      const locationData = {
        zipCode: '',
        city: '',
        state: '',
        stateShort: '',
        country: '',
        countryShort: '',
        coordinates: {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
        },
      };

      // Parse address components
      components.forEach((component) => {
        const { types } = component;

        if (types.includes('postal_code')) {
          locationData.zipCode = component.long_name;
        }
        if (types.includes('locality') && types.includes('political')) {
          locationData.city = component.long_name;
        }
        if (types.includes('administrative_area_level_1') && types.includes('political')) {
          locationData.state = component.long_name;
          locationData.stateShort = component.short_name;
        }
        if (types.includes('country') && types.includes('political')) {
          locationData.country = component.long_name;
          locationData.countryShort = component.short_name;
        }
      });

      return locationData;
    }
    return null;
  } catch (error) {
    console.error('Error getting location data from zip code:', error);
    return null;
  }
};

// Helper function to get dealer coordinates
export const getDealerCoordinates = (dealer) => {
  const googleMapsLocation = _.get(dealer, 'properties.google_maps_location', '');
  if (!googleMapsLocation) return null;

  const coords = googleMapsLocation.split(',').map((coord) => coord.trim());
  if (coords.length !== 2) return null;

  const latitude = parseFloat(coords[0], 10);
  const longitude = parseFloat(coords[1], 10);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

  return { latitude, longitude };
};

export const resetSelectOptions = (name) => {
  const selectElement = document.querySelector(`select[name=${name}]`);

  if (selectElement) {
    for (let index = selectElement.options.length - 1; index > 0; index -= 1) {
      selectElement.options[index].remove();
    }
    selectElement.dispatchEvent(new Event('change'));
  }
};

// Enhanced utility functions for DOM manipulation
export const DOMUtils = {
  querySelector: (selector) => document.querySelector(selector),

  dispatchEvents: (element, events = ['change', 'input']) => {
    if (!element) return;
    events.forEach((eventType) => {
      const event = new Event(eventType, {
        bubbles: true,
        cancelable: true,
        composed: true,
      });
      element.dispatchEvent(event);
    });
  },

  createOption: (value, text) => {
    const option = document.createElement('option');
    option.value = value;
    option.text = text;
    return option;
  },

  // Helper to find city field with your specific structure
  findCityField: () => {
    const selectors = [
      'input[name="city"]',
      'input[id*="city"]',
      'input[autocomplete="address-level2"]',
      'input[placeholder*="City"]',
    ];

    for (const selector of selectors) {
      const field = document.querySelector(selector);
      if (field) {
        console.log(`Found city field: ${field.id || field.name}`);
        return field;
      }
    }

    console.warn('City field not found');
    return null;
  },

  // Helper to find zip field with your specific structure
  findZipField: (lang) => {
    const selectors = [
      'input[name="postal_zip_code"]',
      'input[id*="postal_zip_code"]',
      'input[name="zip"]',
      'input[id*="zip"]',
      'input[autocomplete="postal-code"]',
      'input[placeholder*="Zip"]',
      'input[placeholder*="Postcode"]',
    ];

    for (const selector of selectors) {
      const field = document.querySelector(selector);
      if (field) {
        console.log(`Found zip field: ${field.id || field.name}`);
        return field;
      }
    }

    console.warn('Zip field not found');
    return null;
  },
};

// Auto-fill utilities
export const AutoFillUtils = {
  // Auto-fill city and state from zip code
  autoFillFromZipCode: async (zipCode, lang, CONFIG) => {
    if (!zipCode || zipCode.length < 5) return null;

    console.log(`Auto-filling from zip code: ${zipCode}`);

    const locationData = await getLocationDataFromZipCode(zipCode);
    if (!locationData) {
      console.log('No location data found for zip code');
      return null;
    }

    console.log('Location data retrieved:', locationData);

    // Get form fields with enhanced selectors
    const stateField =
      DOMUtils.querySelector(`select[name="select_state_province"]`) ||
      DOMUtils.querySelector(`select[id*="state"]`) ||
      DOMUtils.querySelector(`select[name*="state"]`);

    const cityField = DOMUtils.findCityField();

    // Auto-fill state if field exists and has options
    if (stateField && locationData.state) {
      console.log('Attempting to fill state field with:', locationData.state);

      // Find the option that matches the state (try both long and short names)
      const stateOption = [...stateField.options].find(
        (option) =>
          option.text === locationData.state ||
          option.text === locationData.stateShort ||
          option.value === locationData.state ||
          option.value === locationData.stateShort,
      );

      if (stateOption && stateField.value !== stateOption.value) {
        stateField.value = stateOption.value;
        stateField.classList.remove('invalid', 'error');
        DOMUtils.dispatchEvents(stateField, ['change', 'input']);
        console.log(`Auto-filled state: ${locationData.state} (${stateOption.value})`);
      } else if (!stateOption) {
        console.log('State option not found in dropdown:', locationData.state);
      }
    }

    // Auto-fill city if field exists
    if (cityField && locationData.city && cityField.value !== locationData.city) {
      console.log('Attempting to fill city field with:', locationData.city);

      cityField.value = locationData.city;

      // Remove error classes if present
      cityField.classList.remove('invalid', 'error');

      DOMUtils.dispatchEvents(cityField, ['change', 'input', 'blur']);
      console.log(`Auto-filled city: ${locationData.city}`);

      // Trigger HubSpot validation if available
      setTimeout(() => {
        const form = cityField.closest('form');
        if (form && window.hbspt) {
          // Force HubSpot to re-validate the field
          const event = new Event('blur', { bubbles: true });
          cityField.dispatchEvent(event);
        }
      }, 100);
    }

    return locationData;
  },

  // Handle state change - clear dependent fields
  handleStateChange: async (stateName, lang, CONFIG) => {
    console.log(`State changed to: ${stateName}`);

    // Get dependent fields
    const cityField = DOMUtils.findCityField();
    const zipField = DOMUtils.findZipField(lang);

    // Clear city and zip when state changes
    if (cityField && cityField.value) {
      cityField.value = '';
      cityField.classList.remove('invalid', 'error');
      DOMUtils.dispatchEvents(cityField, ['change', 'input', 'blur']);
      console.log('Cleared city field due to state change');
    }

    if (zipField && zipField.value) {
      zipField.value = '';
      zipField.classList.remove('invalid', 'error');
      DOMUtils.dispatchEvents(zipField, ['change', 'input', 'blur']);
      console.log('Cleared zip field due to state change');
    }
  },
};
