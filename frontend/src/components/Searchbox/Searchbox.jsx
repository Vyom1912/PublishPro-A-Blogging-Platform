// import React from "react";
import { useState, useEffect } from "react";
import "./Searchbox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSearch } from "../../context/SearchContext";

function Searchbox() {
  const { setSearchQuery } = useSearch();

  const [input, setInput] = useState("");

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(input);
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(input);
    }
  };

  return (
    <div className='searchbox-container flex'>
      <input
        type='text'
        id='search-box'
        placeholder='Search...'
        className='searchbox-input'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <label htmlFor='search-box'>
        {" "}
        <FontAwesomeIcon icon={faMagnifyingGlass} className='nav-icone' />
      </label>
    </div>
  );
}

export default Searchbox;
