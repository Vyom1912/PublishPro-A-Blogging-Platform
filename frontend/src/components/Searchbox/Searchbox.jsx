// import React from "react";
import "./Searchbox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
function Searchbox() {
  return (
    <div className='searchbox-container'>
      <input type='text' placeholder='Search...' className='searchbox-input' />
      <FontAwesomeIcon icon={faMagnifyingGlass} className='nav-icone' />
    </div>
  );
}

export default Searchbox;
