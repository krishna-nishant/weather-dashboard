import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <form className="relative mb-6 group" onSubmit={handleSubmit}>
      <div className="relative flex overflow-hidden rounded-full shadow-md transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
        <div className="flex items-center pl-4 text-gray-400 dark:text-gray-500">
          <Search size={20} />
        </div>
        <input
          type="text"
          className="flex-grow px-4 py-3.5 bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium transition-all duration-300 ease-in-out"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
