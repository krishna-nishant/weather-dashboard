import { useState, useEffect } from 'react';

function useSearchHistory(maxItems = 5) {
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = (city) => {
    const filteredHistory = searchHistory.filter(
      item => item.toLowerCase() !== city.toLowerCase()
    );
    
    const newHistory = [city, ...filteredHistory].slice(0, maxItems);
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };
  
  return {
    searchHistory,
    addToHistory
  };
}

export default useSearchHistory; 