import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  const [showText, setShowText] = useState(false);

  // Consider adding additional information about PM Accel
  const DESCRIPTION = `The Product Manager Accelerator Program is designed to support PM professionals through every stage of their careers. From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped over hundreds of students fulfill their career aspirations.\n
  Our Product Manager Accelerator community are ambitious and committed. Through our program they have learnt, honed and developed new PM and leadership skills, giving them a strong foundation for their future endeavors.`;

  const handleClick = () => {
    setShowText(!showText);
  };

  return (
    <Container fluid className="footer">
      <Row>
        <Col md="4" className="footer-copywright">
          <h1>Ismael Abou Coulibaly</h1>
        </Col>
        <Col
          md="4"
          className="footer-infoButton"
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={handleClick} >
          <h1>PM Accelerator - Info Button</h1>
          {showText && <p>{DESCRIPTION}</p>}
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
