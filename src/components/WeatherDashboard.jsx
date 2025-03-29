import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import RecentSearches from "./RecentSearches";
import Loader from "./ui/loader";
import useSearchHistory from "../hooks/useSearchHistory";
import weatherService from "../services/weatherService";
import { MapPin, Navigation } from "lucide-react";

/**
 * Main dashboard component for the weather application
 * Handles fetching and displaying weather data, user location,
 * and search functionality
 */
function WeatherDashboard() {
  // State for weather data and UI
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  
  // Custom hook for managing search history
  const { searchHistory, addToHistory } = useSearchHistory(5);

  // Check for API key on component mount
  useEffect(() => {
    if (!weatherService.isApiKeyAvailable()) {
      setError(
        "API key is missing. Please add your OpenWeatherMap API key to the .env file."
      );
    }
  }, []);

  /**
   * Fetch weather data for a specific city
   * Updates weather and forecast data, adds city to search history
   */
  const fetchWeather = async (city) => {
    if (!weatherService.isApiKeyAvailable()) {
      setError(
        "API key is missing. Please add your OpenWeatherMap API key to the .env file."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { weatherData: weather, forecastData: forecast } =
        await weatherService.getWeatherAndForecast(city);

      setWeatherData(weather);
      setForecastData(forecast);
      addToHistory(city);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch weather data using geographic coordinates
   * Used when the user uses the "Use My Location" feature
   */
  const fetchWeatherByCoords = async (latitude, longitude) => {
    if (!weatherService.isApiKeyAvailable()) {
      setError(
        "API key is missing. Please add your OpenWeatherMap API key to the .env file."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await weatherService.getWeatherByCoords(latitude, longitude);
      setWeatherData(response.weatherData);
      setForecastData(response.forecastData);
      
      // Add the detected city to search history
      if (response.weatherData && response.weatherData.name) {
        addToHistory(response.weatherData.name);
      }
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle the "Use My Location" button click
   * Uses browser's geolocation API to get user coordinates
   */
  const handleLocationClick = () => {
    setGeoLoading(true);
    setError(null);
    
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setGeoLoading(false);
      return;
    }
    
    // Request the user's current position
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
        setGeoLoading(false);
      },
      // Error callback with specific error messages
      (error) => {
        let errorMessage = "Failed to get your location";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "An unknown error occurred";
        }
        setError(errorMessage);
        setGeoLoading(false);
      }
    );
  };
  
  // Show initial content only when no weather data, no loading, and no errors
  const showInitialContent = !weatherData && !loading && !error;

  return (
    <>
      {/* Search bar component */}
      <SearchBar onSearch={fetchWeather} />
      
      {/* Conditional rendering based on application state */}
      {showInitialContent ? (
        // Show location button when no weather data is displayed
        <div className="mt-6 mb-8">
          <div className="flex flex-col items-center">
            <p className="text-gray-600 dark:text-gray-300 mb-3 text-center">
              Get weather for your current location
            </p>
            <button
              onClick={handleLocationClick}
              disabled={geoLoading}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 border border-blue-100 dark:border-blue-900 group"
              aria-label="Use my current location for weather"
            >
              {geoLoading ? (
                // Loading state for location button
                <>
                  <div className="w-5 h-5 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium">Getting location...</span>
                </>
              ) : (
                // Default state for location button
                <>
                  <Navigation size={20} className="text-blue-500 dark:text-blue-400 group-hover:rotate-45 transition-transform duration-300" />
                  <span className="font-medium">Use My Location</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        // Show recent searches when weather data is displayed
        <RecentSearches searches={searchHistory} onSelect={fetchWeather} />
      )}

      {/* Loading indicator or weather card */}
      {loading ? (
        // Loading state
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl p-8 text-center shadow-lg animate-pulse">
          <Loader size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Fetching weather data...
          </p>
        </div>
      ) : (
        // Weather display
        <WeatherCard
          weatherData={weatherData}
          forecastData={forecastData}
          error={error}
          onRefresh={fetchWeather}
        />
      )}
    </>
  );
}

export default WeatherDashboard;
