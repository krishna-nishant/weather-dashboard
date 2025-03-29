import { useState, useEffect } from 'react';

// Custom hook to manage search history with localStorage persistence
function useSearchHistory(maxItems = 5) {
  const [searchHistory, setSearchHistory] = useState([]);

  // Load saved search history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  /**
   * Add a new city to search history
   * - Removes any existing entries with the same name (case-insensitive)
   * - Adds the new city at the beginning of the list
   * - Limits the total items to maxItems
   * - Persists the updated history to localStorage
   */
  const addToHistory = (city) => {
    // Remove existing instance of this city (if any)
    const filteredHistory = searchHistory.filter(
      item => item.toLowerCase() !== city.toLowerCase()
    );
    
    // Create new history with new city at the beginning, limited to maxItems
    const newHistory = [city, ...filteredHistory].slice(0, maxItems);
    
    // Update state and save to localStorage
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };
  
  return {
    searchHistory,
    addToHistory
  };
}

export default useSearchHistory; 