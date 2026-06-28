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
// import { useState, useEffect, useRef } from "react";
// import "./Searchbox.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
// import { useSearch } from "../../context/SearchContext";

// const PLACEHOLDERS = [
//   "Search by title…",
//   "Search by author…",
//   "Search by category…",
//   "Search by tag…",
// ];

// function Searchbox() {
//   const { setSearchQuery } = useSearch();
//   const [input, setInput] = useState("");
//   const [placeholderIdx, setPlaceholderIdx] = useState(0);
//   const [isFocused, setIsFocused] = useState(false);
//   const inputRef = useRef(null);

// 
//   // Debounce — fire search 400 ms after the user stops typing
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchQuery(input.trim());
//     }, 400);
//     return () => clearTimeout(timer);
//   }, [input]);

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") setSearchQuery(input.trim());
//     if (e.key === "Escape") handleClear();
//   };

//   const handleClear = () => {
//     setInput("");
//     setSearchQuery("");
//     inputRef.current?.focus();
//   };

//   return (
//     <div className={`searchbox-container${isFocused ? " focused" : ""}`}>
//       <FontAwesomeIcon icon={faMagnifyingGlass} className="nav-icone search-icon-left" />

//       <input
//         ref={inputRef}
//         type="text"
//         id="search-box"
//         
//         onFocus={() => setIsFocused(true)}
//         onBlur={() => setIsFocused(false)}
//         autoComplete="off"
//         aria-label="Search blogs"
//       />

//       {/* Clear button — only visible when there's text */}
//       {input && (
//         <button
//           className="search-clear-btn"
//           onClick={handleClear}
//           aria-label="Clear search"
//           type="button"
//         >
//           <FontAwesomeIcon icon={faXmark} />
//         </button>
//       )}
//     </div>
//   );
// }

// export default Searchbox;
