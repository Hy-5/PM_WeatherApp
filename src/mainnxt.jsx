import React from 'react';
import { createRoot } from 'react-dom/client';
import DayCards from './components/dayCard.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import localImgHolder from './assets/placeholder.webp';
import 'bootstrap/dist/css/bootstrap.min.css';

function MainApp() {
  // Get current + next 4 days
  const generateWeekdays = () => {
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
        //description: `${dayName}, ${dayDate}. Customized Description from weather API CALL.`,
        //date: `${dayName}, ${dayDate}.`,
        description: `Customized Description - Retrieve from weather API CALL.`,
        imgPath: localImgHolder,
        key: i
      });
    }
    
    return days;
  };

  const weekdays = generateWeekdays();

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">5 Day Forecast</h1>
      <Row>
        {weekdays.map((day) => (
          <Col key={day.key} xs={12} md={6} lg={4} className="mb-3">
            
            {/*Experimenting with the design of the card. Cleanup unused code later.*/}

            <DayCards
              //title={day.title}
              title={day.dateTitle}
              //date={day.date}
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