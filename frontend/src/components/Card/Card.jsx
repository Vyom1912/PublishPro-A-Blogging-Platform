// import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Card.css";
function Card({ id, title, imgSrc }) {
  return (
    <Link to={`blog/${id}`} className='card-link'>
      <div className='card'>
        <img src={imgSrc} alt='card' />
        <h3>
          {title}
          <FontAwesomeIcon icon={faArrowRight} className='card-icone' />
        </h3>
        {/* <p>{description}</p> */}
      </div>
    </Link>
  );
}

export default Card;
