import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Autosuggest from 'react-autosuggest';
import DayCards from './dayCard.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import localImgHolder from '../assets/placeholder.webp';
import { useLocation, useNavigate } from 'react-router-dom';
import rain from '../assets/rain.webp';
import snow from '../assets/snow.webp';
import sun from '../assets/sun.webp';
import cloud from '../assets/cloud.webp';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './footer.jsx';
import { Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import AppNavbar from './navbar.jsx';
import { useGeoLocationService, getSuggestionValue, renderSuggestion } from './locPull.jsx';
import '../style.css';

function MainApp() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.username ? {
    username: location.state.username,
    password: location.state.password,
    location: location.state.location,
    lat: location.state.lat,
    lon: location.state.lon
  } : null;

  const lat = user?.lat ?? 29.7604;
  const lon = user?.lon ?? -95.3698;

  const [currentLocation, setCurrentLocation] = useState({
    lat,
    lon,
    name: user?.location ?? 'Houston, TX'
  });

  const API_KEY = '9a237f649b55a4f5183dd716c1fa7d1c';
  const { getSuggestions: fetchSuggestions } = useGeoLocationService(API_KEY);

  const getWeatherImage = (description, weatherMain) => {
    const desc = description.toLowerCase();
    const main = weatherMain.toLowerCase();
    if (desc.includes('rain') || main.includes('rain')) return rain;
    if (desc.includes('snow') || main.includes('snow')) return snow;
    if (desc.includes('sun') || desc.includes('clear') || main.includes('clear')) return sun;
    if (desc.includes('cloud') || main.includes('cloud')) return cloud;
    return localImgHolder;
  };

  const fetchWeatherData = async (lat = currentLocation.lat, lon = currentLocation.lon) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=imperial`
      );
      if (!response.ok) throw new Error(`Failed: ${response.status}`);
      const data = await response.json();
      setWeatherData(processWeatherData(data));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processWeatherData = (data) => {
    return data.daily.slice(0, 5).map((dayData, index) => {
      const date = new Date(dayData.dt * 1000);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const description = dayData.weather[0].description;
      const weatherMain = dayData.weather[0].main;
      return {
        title: dayName,
        dateTitle: `${dayName}, ${dayDate}`,
        description: `${Math.round(dayData.temp.max)}°/${Math.round(dayData.temp.min)}°F - ${description.charAt(0).toUpperCase() + description.slice(1)}`,
        summary: dayData.summary || description,
        weather: weatherMain,
        highTemp: Math.round(dayData.temp.max),
        lowTemp: Math.round(dayData.temp.min),
        imgPath: getWeatherImage(description, weatherMain),
        key: index
      };
    });
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setCurrentLocation({ lat: coords.latitude, lon: coords.longitude, name: 'Your Current Location' });
          fetchWeatherData(coords.latitude, coords.longitude);
        },
        () => fetchWeatherData()
      );
    } else {
      fetchWeatherData();
    }
  };

  useEffect(() => {
    if (user?.lat && user?.lon && user?.location) {
      setCurrentLocation({ lat: user.lat, lon: user.lon, name: user.location });
      fetchWeatherData(user.lat, user.lon);
    } else {
      getUserLocation();
    }
  }, []);

  const onSuggestionsFetchRequested = ({ value }) => {
    fetchSuggestions(value, setSuggestions);
  };

  const onSuggestionsClearRequested = () => setSuggestions([]);
  const onChange = (e, { newValue }) => setSearch(newValue);

  const onSuggestionSelected = (e, { suggestion }) => {
    setCurrentLocation({
      lat: suggestion.lat,
      lon: suggestion.lon,
      name: suggestion.name
    });
    fetchWeatherData(suggestion.lat, suggestion.lon);
  };

  const generateFallbackData = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  return (
    <>
      <AppNavbar user={user} />
      <Container className="mt-4">
        <Button
          variant="link"
          onClick={() => navigate('/')}
          className="mb-2 text-decoration-none d-flex align-items-center"
        >
          <ArrowLeft className="me-2" /> Back
        </Button>

        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            placeholder: 'Enter location..',
            value: search,
            onChange,
            className: 'form-control mb-3'
          }}
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
    </>
  );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<MainApp />);

export default MainApp;