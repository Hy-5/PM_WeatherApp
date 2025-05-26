import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Autosuggest from 'react-autosuggest';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
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
import { Button, Form } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import AppNavbar from './navbar.jsx';
import { useGeoLocationService, getSuggestionValue, renderSuggestion } from './locPull.jsx';
import '../style.css';

function MainApp() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id, username, password, location: locName, lat: initLat, lon: initLon } = state || {};

  const user = username
    ? { id, username, password, location: locName, lat: initLat, lon: initLon }
    : null;

  const defaultLat = 29.7604;
  const defaultLon = -95.3698;
  const lat = user?.lat ?? defaultLat;
  const lon = user?.lon ?? defaultLon;

  const [search, setSearch] = useState(user?.historyLocation || locName || '');
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ lat, lon, name: user?.location ?? 'Houston, TX' });

  // Default date range: today to next 4 days
  const today = new Date();
  const defaultEnd = new Date();
  defaultEnd.setDate(today.getDate() + 4);
  const [dateRange, setDateRange] = useState(() => {
    if (user?.historyDate_range) {
      return [{
      startDate: new Date(user.historyDate_range.start),
      endDate:   new Date(user.historyDate_range.end),
      key: 'selection'
      }];
    }
    return [{ startDate: new Date(), endDate: defaultEnd, key: 'selection' }];
  });

  useEffect(() => {
    if (!user) return;
    const payload = {
      historyDate_range: {
        start: dateRange[0].startDate.toISOString(),
        end:   dateRange[0].endDate.toISOString()
      },
      historyLocation: search
    };
    fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(console.error);
  }, [user, search, dateRange]);

  const formattedHistoryDateRange = `${dateRange[0].startDate.toLocaleDateString()} – ${dateRange[0].endDate.toLocaleDateString()}`;
  const [showCalendar, setShowCalendar] = useState(false);

  const API_KEY = '9a237f649b55a4f5183dd716c1fa7d1c';
  const { getSuggestions: fetchSuggestions } = useGeoLocationService(API_KEY);

  // Handle date selection: only mirror end when user explicitly selects end
  const handleDateChange = ({ selection }) => {
    let { startDate: newStart, endDate: newEnd } = selection;
    // if only click (start == end), keep previous end
    if (newEnd.getTime() === newStart.getTime()) {
      newEnd = dateRange[0].endDate;
    }
    // ensure startDate <= endDate
    if (newStart > newEnd) {
      [newStart, newEnd] = [newEnd, newStart];
    }
    setDateRange([{ startDate: newStart, endDate: newEnd, key: 'selection' }]);
    setShowCalendar(false);
  };

  const getWeatherImage = (description, weatherMain) => {
    const desc = description.toLowerCase();
    const main = weatherMain.toLowerCase();
    if (desc.includes('rain') || main.includes('rain')) return rain;
    if (desc.includes('snow') || main.includes('snow')) return snow;
    if (desc.includes('sun') || desc.includes('clear') || main.includes('clear')) return sun;
    if (desc.includes('cloud') || main.includes('cloud')) return cloud;
    return localImgHolder;
  };

  const processWeatherData = (data) =>
    data.daily.slice(0, 5).map((dayData, index) => {
      const date = new Date(dayData.dt * 1000);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const description = dayData.weather[0].description;
      const weatherMain = dayData.weather[0].main;
      return {
        dateTitle: `${dayName}, ${dayDate}`,
        description: `${Math.round(dayData.temp.max)}°/${Math.round(dayData.temp.min)}°F – ${description}`,
        imgPath: getWeatherImage(description, weatherMain),
        key: index
      };
    });

  const fetchWeatherData = async (latVal = currentLocation.lat, lonVal = currentLocation.lon) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latVal}&lon=${lonVal}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=imperial`
      );
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const json = await res.json();
      setWeatherData(processWeatherData(json));
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // try user’s saved location first, else geolocate
  useEffect(() => {
    if (user?.lat && user?.lon && user?.location) {
      setCurrentLocation({ lat: user.lat, lon: user.lon, name: user.location });
      fetchWeatherData(user.lat, user.lon);
    } else {
      navigator.geolocation?.getCurrentPosition(
        ({ coords }) => {
          setCurrentLocation({ lat: coords.latitude, lon: coords.longitude, name: 'Your Location' });
          fetchWeatherData(coords.latitude, coords.longitude);
        },
        () => fetchWeatherData()
      );
    }
  }, []);

  const onSuggestionsFetchRequested = ({ value }) => fetchSuggestions(value, setSuggestions);
  const onSuggestionsClearRequested = () => setSuggestions([]);
  const onChange = (e, { newValue }) => setSearch(newValue);
  const onSuggestionSelected = (e, { suggestion }) => {
    setCurrentLocation({ lat: suggestion.lat, lon: suggestion.lon, name: suggestion.name });
    fetchWeatherData(suggestion.lat, suggestion.lon);
  };

  const generateFallbackData = () => {
    const today = new Date();
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const dayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        dateTitle: `${dayName}, ${dayDate}`,
        description: 'Weather data unavailable',
        imgPath: localImgHolder,
        key: i
      };
    });
  };

  const displayData = error ? generateFallbackData() : weatherData;

  return (
    <>
      <AppNavbar
        user={user}
        historyDateRange={formattedHistoryDateRange}
        historyLocation={search}
      />
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
            placeholder: 'Enter location…',
            value: search,
            onChange,
            className: 'form-control mb-3'
          }}
        />

        {/* Date range picker trigger */}
        <Form.Group className="mb-3 d-flex gap-3">
          <Form.Label className="mb-0"><strong>Start Date:</strong></Form.Label>
          <Form.Control
            readOnly
            value={dateRange[0].startDate.toLocaleDateString()}
            onClick={() => setShowCalendar(prev => !prev)}
            style={{ cursor: 'pointer', width: 'auto' }}
          />
          <Form.Label className="mb-0"><strong>End Date:</strong></Form.Label>
          <Form.Control
            readOnly
            value={dateRange[0].endDate.toLocaleDateString()}
            onClick={() => setShowCalendar(prev => !prev)}
            style={{ cursor: 'pointer', width: 'auto' }}
          />
        </Form.Group>
        {showCalendar && (
          <DateRange
            ranges={dateRange}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            months={1}
            direction="horizontal"
          />
        )}

        <h1 className="text-center mb-4">
          5-Day Forecast – {currentLocation.name}
          {loading && <small className="text-muted d-block">Loading…</small>}
          {error && <small className="text-danger d-block">Using fallback data</small>}
        </h1>

        <Row>
          {displayData.map(day => (
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