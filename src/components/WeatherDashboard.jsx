import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import RecentSearches from "./RecentSearches";
import Loader from "./ui/loader";
import useSearchHistory from "../hooks/useSearchHistory";
import weatherService from "../services/weatherService";
import { MapPin, Navigation } from "lucide-react";

function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const { searchHistory, addToHistory } = useSearchHistory(5);

  useEffect(() => {
    if (!weatherService.isApiKeyAvailable()) {
      setError(
        "API key is missing. Please add your OpenWeatherMap API key to the .env file."
      );
    }
  }, []);

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

  const handleLocationClick = () => {
    setGeoLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setGeoLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
        setGeoLoading(false);
      },
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
  
  const showInitialContent = !weatherData && !loading && !error;

  return (
    <>
      <SearchBar onSearch={fetchWeather} />
      
      {showInitialContent ? (
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
                <>
                  <div className="w-5 h-5 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium">Getting location...</span>
                </>
              ) : (
                <>
                  <Navigation size={20} className="text-blue-500 dark:text-blue-400 group-hover:rotate-45 transition-transform duration-300" />
                  <span className="font-medium">Use My Location</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <RecentSearches searches={searchHistory} onSelect={fetchWeather} />
      )}

      {loading ? (
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl p-8 text-center shadow-lg animate-pulse">
          <Loader size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Fetching weather data...
          </p>
        </div>
      ) : (
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
