import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Searchbox.css";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import { useSearch } from "../../context/SearchContext";

function Searchbox() {
  const { searchInput, setSearchInput, submitSearch, clearSearch } = useSearch();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Press "/" anywhere (outside a text field) to jump to search
  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement?.tagName;
      const typing =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" ||
        document.activeElement?.isContentEditable;
      if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Results are shown on page 1 of the home page, so take the user there
  const showResults = () => {
    if (pathname !== "/" || search) {
      navigate("/", { replace: pathname === "/" });
    }
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value);
    showResults();
  };

  const handleClear = () => {
    clearSearch();
    showResults();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitSearch();
    showResults();
    // Hide the on-screen keyboard on phones
    e.target.querySelector("input")?.blur();
  };

  return (
    <form className='searchbox-container flex' role='search' onSubmit={handleSubmit}>
      <label htmlFor='search-box' className='flex'>
        <FaMagnifyingGlass className='nav-icone' />
      </label>
      <input
        ref={inputRef}
        type='search'
        id='search-box'
        placeholder='Search blogs...'
        className='searchbox-input'
        value={searchInput}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Escape" && handleClear()}
        autoComplete='off'
        enterKeyHint='search'
        aria-label='Search blogs by title, tag, category or author'
      />
      {!searchInput && (
        <kbd className='search-kbd' title='Press / to search'>
          /
        </kbd>
      )}
      {searchInput && (
        <button
          type='button'
          className='search-clear-btn flex'
          onClick={handleClear}
          aria-label='Clear search'>
          <FaXmark />
        </button>
      )}
    </form>
  );
}

export default Searchbox;
