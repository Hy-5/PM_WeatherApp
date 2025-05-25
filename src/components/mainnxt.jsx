import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Autosuggest from 'react-autosuggest';
import DayCards from './dayCard.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import localImgHolder from '../assets/placeholder.webp';
import rain from '../assets/rain.webp';
import snow from '../assets/snow.webp';
import sun from '../assets/sun.webp';
import cloud from '../assets/cloud.webp';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './footer.jsx';
import { useGeoLocationService, getSuggestionValue, renderSuggestion } from './locPull.jsx';
import '../style.css';

function MainApp() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 29.7604, lon: -95.3698, name: 'Houston, TX' });

  // OBFUSCATE LATER
  const API_KEY = '9a237f649b55a4f5183dd716c1fa7d1c';

  // Initialize geo location service
  // Using same source for to avoid separate API calls
  const { getSuggestions: fetchSuggestions } = useGeoLocationService(API_KEY);

  // cascading image selection based on text desc | COMPLETE if some descs were not considered
  const getWeatherImage = (description, weatherMain) => {
    const desc = description.toLowerCase();
    const main = weatherMain.toLowerCase();
    
    if (desc.includes('rain') || main.includes('rain')) {
      return rain;
    } else if (desc.includes('snow') || main.includes('snow')) {
      return snow;
    } else if (desc.includes('sun') || desc.includes('clear') || main.includes('clear')) {
      return sun;
    } else if (desc.includes('cloud') || main.includes('cloud')) {
      return cloud;
    }
    
    return localImgHolder;
  };

  // Pull weather data using coordinates
  const fetchWeatherData = async (lat = currentLocation.lat, lon = currentLocation.lon) => {
    try {
      setLoading(true);
      console.log('Fetching weather data for:', lat, lon);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=imperial`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Weather data pull failed: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Weather data received:', data);
      const processedData = processWeatherData(data);
      setWeatherData(processedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Process One Call API data into 5-day forecast
  const processWeatherData = (data) => {
    const dailyForecasts = [];
    
    data.daily.slice(0, 5).forEach((dayData, index) => {
      const date = new Date(dayData.dt * 1000);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      const highTemp = Math.round(dayData.temp.max);
      const lowTemp = Math.round(dayData.temp.min);
      const description = dayData.weather[0].description;
      const summary = dayData.summary || description;
      const weatherMain = dayData.weather[0].main;

      const weatherImage = getWeatherImage(description, weatherMain);

      dailyForecasts.push({
        title: dayName,
        dateTitle: `${dayName}, ${dayDate}`,
        description: `${highTemp}°/${lowTemp}°F - ${description.charAt(0).toUpperCase() + description.slice(1)}`,
        summary: summary,
        weather: weatherMain,
        highTemp: highTemp,
        lowTemp: lowTemp,
        imgPath: weatherImage,
        key: index
      });
    });

    return dailyForecasts;
  };

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            lat: latitude,
            lon: longitude,
            name: 'Your Current Location'
          });
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.warn('Geolocation failed:', error);
          // Fall back to default Houston, TX
          fetchWeatherData();
        }
      );
    } else {
      console.warn('Geolocation not supported');
      fetchWeatherData();
    }
  };

  // Fetch weather data on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Autosuggest handlers
  const onSuggestionsFetchRequested = ({ value }) => {
    fetchSuggestions(value, (locationSuggestions) => {
      setSuggestions(locationSuggestions);
    });
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChange = (event, { newValue }) => {
    setSearch(newValue);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    console.log('Location selected:', suggestion);
    setCurrentLocation({
      lat: suggestion.lat,
      lon: suggestion.lon,
      name: suggestion.name
    });
    // Fetch weather for new location
    fetchWeatherData(suggestion.lat, suggestion.lon);
  };

  // Fallback data generation
  const generateFallbackData = () => {
    const days = [];
    const today = new Date();
   
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
     
      days.push({
        title: dayName,
        dateTitle: `${dayName}, ${dayDate}`,
        description: `Weather data unavailable`,
        imgPath: localImgHolder,
        key: i
      });
    }
   
    return days;
  };

  const displayData = error ? generateFallbackData() : weatherData;

  // Input props for autosuggest
  const inputProps = {
    placeholder: 'Enter location..',
    value: search,
    onChange: onChange,
    className: 'form-control mb-3'
  };

  return (
    <Container className="mt-4">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        theme={{
          container: 'position-relative',
          suggestionsContainer: 'position-absolute w-100',
          suggestionsContainerOpen: 'border border-secondary rounded bg-white shadow-sm',
          suggestionsList: 'list-unstyled m-0 p-0',
          suggestion: 'px-3 py-2 cursor-pointer',
          suggestionHighlighted: 'bg-light'
        }}
      />
      
      <h1 className="text-center mb-4">
        5 Day Forecast - {currentLocation.name}
        {loading && <small className="text-muted d-block">Loading...</small>}
        {error && <small className="text-danger d-block">Using fallback data</small>}
      </h1>
      
      <Row>
        {displayData.map((day) => (
          <Col key={day.key} xs={12} md={6} lg={4} className="mb-3">
            <DayCards
              title={day.dateTitle}
              description={day.description}
              imgPath={day.imgPath}
              imgClass="weather-img"
            />
          </Col>
        ))}
      </Row>
      <Footer />
    </Container>
  );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<MainApp />);

export default MainApp;