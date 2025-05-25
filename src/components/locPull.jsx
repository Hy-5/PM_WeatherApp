import React from 'react';

// OpenWeather Geocoding API service
class GeoLocationService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openweathermap.org/geo/1.0/direct';
    this.cache = new Map();
    this.debounceTimer = null;
  }

  // Start pulling when length > 2 and limit search results to 5
  async fetchLocationSuggestions(query, limit = 5) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const trimmedQuery = query.trim();
    
    // Check cache first
    const cacheKey = `${trimmedQuery}_${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const url = `${this.baseUrl}?q=${encodeURIComponent(trimmedQuery)}&limit=${limit}&appid=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      const suggestions = this.formatSuggestions(data);
      
      // Cache the results
      this.cache.set(cacheKey, suggestions);
      
      return suggestions;
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      return [];
    }
  }

  // Format API response into suggestion objects
  formatSuggestions(data) {
    return data.map(location => ({
      name: this.formatLocationName(location),
      lat: location.lat,
      lon: location.lon,
      country: location.country,
      state: location.state || null,
      raw: location
    }));
  }

  // Format location name for display
  formatLocationName(location) {
    let name = location.name;
    
    if (location.state && location.country === 'US') {
      name += `, ${location.state}`;
    }
    
    name += `, ${location.country}`;
    
    return name;
  }

  // Debounced search to avoid too many API calls
  debouncedSearch(query, callback, delay = 300) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(async () => {
      const suggestions = await this.fetchLocationSuggestions(query);
      callback(suggestions);
    }, delay);
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

// Hook for using geo location service
export const useGeoLocationService = (apiKey) => {
  const [service] = React.useState(() => new GeoLocationService(apiKey));
  
  const getSuggestions = React.useCallback((value, callback) => {
    service.debouncedSearch(value, callback);
  }, [service]);

  const getSuggestionsSync = React.useCallback(async (value) => {
    return await service.fetchLocationSuggestions(value);
  }, [service]);

  return {
    getSuggestions,
    getSuggestionsSync,
    clearCache: () => service.clearCache()
  };
};

// Utility functions for react-autosuggest
export const getSuggestionValue = (suggestion) => suggestion.name;

export const renderSuggestion = (suggestion) => (
  <div>
    <strong>{suggestion.name.split(',')[0]}</strong>
    <small className="text-muted ms-2">
      {suggestion.name.split(',').slice(1).join(',').trim()}
    </small>
  </div>
);

export default GeoLocationService;