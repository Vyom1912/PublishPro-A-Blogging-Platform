// import React from "react";
import "./Searchbox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
function Searchbox() {
  return (
    <div className='searchbox-container flex'>
      <input
        type='text'
        id='search-box'
        placeholder='Search...'
        className='searchbox-input'
      />
      <label htmlFor='search-box'>
        {" "}
        <FontAwesomeIcon icon={faMagnifyingGlass} className='nav-icone' />
      </label>
    </div>
  );
}

export default Searchbox;
