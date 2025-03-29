import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import locationService from "../services/locationService";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Fetch suggestions when input changes
  useEffect(() => {
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only search if we have at least 2 characters
    if (city.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setError("");
      return;
    }

    // Show loading indicator
    setLoading(true);
    setError("");

    // Set a delay before making API call
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Get suggestions from service
        const results = await locationService.getCitySuggestions(city);
        setSuggestions(results);
        setActiveSuggestion(-1);

        // Show suggestions if we have results and input is focused
        setShowSuggestions(
          results.length > 0 && document.activeElement === inputRef.current
        );

        // Show error if no results
        if (results.length === 0) {
          setError(
            "No matching cities found. Please try a different search term."
          );
        }
      } catch (err) {
        setError("Failed to fetch suggestions - please try again");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [city]);

  // Handle outside clicks to close suggestion box
  useEffect(() => {
    function handleClickOutside(event) {
      const clickedOutsideSuggestions =
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target);
      const clickedOutsideInput =
        inputRef.current && !inputRef.current.contains(event.target);

      if (clickedOutsideSuggestions && clickedOutsideInput) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search form submission
  function handleSubmit(e) {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setShowSuggestions(false);
    }
  }

  // Handle suggestion click
  function handleSuggestionClick(suggestion) {
    setCity(suggestion.name);
    setShowSuggestions(false);
    // Small delay to ensure UI updates first
    setTimeout(() => onSearch(suggestion.name), 10);
  }

  // Show suggestions on input focus
  function handleFocus() {
    if (city.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }

  // Handle keyboard navigation
  function handleKeyDown(e) {
    // Handle escape key regardless of suggestions
    if (e.key === "Escape") {
      setShowSuggestions(false);
      return;
    }

    // Skip if no suggestions visible
    if (!showSuggestions || suggestions.length === 0) {
      return;
    }

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev <= 0 ? suggestions.length - 1 : prev - 1
        );
        break;

      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev >= suggestions.length - 1 ? 0 : prev + 1
        );
        break;

      case "Enter":
        if (activeSuggestion >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[activeSuggestion]);
        }
        break;
    }
  }

  // Highlight matching text in suggestions
  function highlightMatch(text, query) {
    if (!query.trim()) return text;

    // Create regex to find matches (escape special chars)
    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span
              key={i}
              className="font-semibold text-blue-600 dark:text-blue-400"
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  }

  return (
    <form className="relative mb-6 group" onSubmit={handleSubmit}>
      {/* Search input field */}
      <div className="relative flex overflow-hidden rounded-full shadow-md transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
        <div className="flex items-center pl-4 text-gray-400 dark:text-gray-500">
          <Search size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="flex-grow px-4 py-3.5 bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-label="Search for a city"
          aria-autocomplete="list"
          aria-controls={showSuggestions ? "city-suggestions" : undefined}
          aria-activedescendant={
            activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined
          }
        />
        <button
          type="submit"
          className="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium transition-all duration-300 ease-in-out"
        >
          Search
        </button>
      </div>

      {/* City suggestions dropdown */}
      {(showSuggestions || loading) && (
        <div
          ref={suggestionsRef}
          id="city-suggestions"
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden animate-in fade-in duration-200"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="inline-block w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mr-2"></div>
              Loading suggestions...
            </div>
          ) : (
            <>
              {error && (
                <div className="p-2 text-center text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {suggestions.length > 0 && (
                <ul className="py-1">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      id={`suggestion-${index}`}
                      role="option"
                      aria-selected={index === activeSuggestion}
                      className={`px-4 py-2.5 cursor-pointer flex items-center gap-2 transition-colors ${
                        index === activeSuggestion
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <MapPin
                        size={16}
                        className="text-gray-400 dark:text-gray-500"
                      />
                      <div className="flex-1">
                        <p className="text-gray-700 dark:text-gray-200 font-medium">
                          {highlightMatch(suggestion.name, city)}
                        </p>
                        <div className="flex flex-wrap text-xs text-gray-500 dark:text-gray-400">
                          <span className="mr-2">{suggestion.fullName}</span>
                          {suggestion.latitude && suggestion.longitude && (
                            <span className="text-gray-400 dark:text-gray-500">
                              • {parseFloat(suggestion.latitude).toFixed(2)},{" "}
                              {parseFloat(suggestion.longitude).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
