import React from "react";
import { Clock } from "lucide-react";

/**
 * RecentSearches component displays a list of recently searched cities
 * Allows users to quickly access previously viewed locations
 */
const RecentSearches = ({ searches, onSelect }) => {
  // Don't render if there are no recent searches
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 animate-fadeIn">
      {/* Header with clock icon */}
      <div className="flex items-center mb-3">
        <Clock size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Recent Searches
        </h3>
      </div>
      
      {/* Recent searches buttons */}
      <div className="flex flex-wrap gap-2">
        {searches.map((city, index) => (
          <button
            key={index}
            onClick={() => onSelect(city)}
            className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-sm"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
