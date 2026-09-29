import { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  // What's typed in the box vs. the (debounced) query the home page searches for
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce — search 400 ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const submitSearch = () => setSearchQuery(searchInput.trim());

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  return (
    <SearchContext.Provider
      value={{
        searchInput,
        setSearchInput,
        searchQuery,
        submitSearch,
        clearSearch,
      }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
