// import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
// import { Link } from "react-router-dom";
import "./Card.css";
function Card({ id, title, imgSrc, description }) {
  return (
    // <Link to={`blog/${id}`} className='card-link'>
    <div className='card  flex'>
      <div className='card-img'>
        <img src={imgSrc} alt='card' />
      </div>
      <div className='card-info flex'>
        <h3 className='flex'>
          <span className='card-title'> {title}</span>
          <FontAwesomeIcon icon={faArrowRight} className='card-icone' />
        </h3>

        <div className='card-description'>
          <p className='description-content'>{description || " "}</p>
        </div>
      </div>
    </div>
    // </Link>
  );
}

export default Card;
