import React from "react";
import Card from "react-bootstrap/Card";
import '../style.css';

// weather card component | make it smaller / prettier
function dayCards(props) {
  return (
    <Card className="dayCard-view">
      <Card.Img variant="top"
        src={props.imgPath}
        alt="card-img"
        className={props.imgClass}
        />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text style={{ textAlign: "center" }}>
          {props.date}
        </Card.Text>
        <Card.Text style={{ textAlign: "justify" }}>
          {props.description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default dayCards;