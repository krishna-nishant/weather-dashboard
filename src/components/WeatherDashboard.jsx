import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import RecentSearches from "./RecentSearches";
import Loader from "./ui/loader";
import useSearchHistory from "../hooks/useSearchHistory";
import weatherService from "../services/weatherService";

function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  return (
    <>
      <SearchBar onSearch={fetchWeather} />
      <RecentSearches searches={searchHistory} onSelect={fetchWeather} />

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
