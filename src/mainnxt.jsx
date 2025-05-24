import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Autosuggest from 'react-autosuggest';
import DayCards from './components/dayCard.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import localImgHolder from './assets/placeholder.webp';
import 'bootstrap/dist/css/bootstrap.min.css';
import { locationData, getSuggestions, getSuggestionValue, renderSuggestion } from './mockData.jsx';

function MainApp() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Autosuggest handlers
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChange = (event, { newValue }) => {
    setSearch(newValue);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    console.log('Location selected from suggestions:', suggestion);
  };

  // Get current + next 4 days
  const generateWeekdays = () => {
    const days = [];
    const today = new Date();
   
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // date formatting - consider localization later
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
     
      days.push({
        title: dayName,
        dateTitle: `${dayName}, ${dayDate}`,
        description: `Customized Description - Retrieve from weather API CALL.`,
        //description: `${dayName}, ${dayDate}. Customized Description from weather API CALL.`,
        //date: `${dayName}, ${dayDate}.`,
        imgPath: localImgHolder,
        key: i
      });
    }
   
    return days;
  };

  const weekdays = generateWeekdays();

  // text input + autosuggest
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
      <h1 className="text-center mb-4">5 Day Forecast</h1>
      <Row>
        {weekdays.map((day) => (
          <Col key={day.key} xs={12} md={6} lg={4} className="mb-3">
            <DayCards
              title={day.dateTitle}
              description={day.description}
              imgPath={day.imgPath}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<MainApp />);
export default MainApp;