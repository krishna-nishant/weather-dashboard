import React from "react";
import { RefreshCw, Droplets, Wind } from "lucide-react";

/**
 * Weather card component to display current weather and forecast
 * Shows either weather data or error message
 */
const WeatherCard = ({
  weatherData,
  forecastData,
  error,
  onRefresh,
}) => {
  // Error state handling
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg border border-red-200 dark:border-red-900 animate-fadeIn">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Error
        </h2>
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  // Don't render anything if there's no weather data
  if (!weatherData) {
    return null;
  }

  // Process the forecast data to get daily forecasts
  const dailyForecasts = forecastData ? processForecastData(forecastData) : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Current weather section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
        {/* Gradient header with city name */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 mix-blend-multiply"></div>
          <div className="p-6 relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1 flex items-center">
                  {weatherData.name}, {weatherData.sys.country}
                  {/* Refresh button */}
                  <button
                    onClick={() => onRefresh(weatherData.name)}
                    className="ml-2 p-1 text-white/70 hover:text-white rounded-full transition-colors"
                    title="Refresh weather data"
                  >
                    <RefreshCw
                      size={16}
                      className="transition-transform hover:rotate-180 duration-500"
                    />
                  </button>
                </h2>
                {/* Current date display */}
                <p className="text-blue-100 text-sm">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              {/* Weather icon */}
              <div className="flex items-center">
                <img
                  className="w-24 h-24 object-contain filter drop-shadow-lg"
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                  alt={weatherData.weather[0].description}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weather details section */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Temperature and conditions */}
            <div className="mb-4 md:mb-0">
              <div className="flex items-end">
                <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
                  {Math.round(weatherData.main.temp)}°
                </h1>
                <p className="ml-2 text-lg text-gray-500 dark:text-gray-400 capitalize pb-1">
                  {weatherData.weather[0].description}
                </p>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Feels like {Math.round(weatherData.main.feels_like)}°C
              </p>
            </div>

            {/* Additional weather metrics */}
            <div className="grid grid-cols-2 gap-4">
              {/* Humidity indicator */}
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 mr-3">
                  <Droplets size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Humidity
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {weatherData.main.humidity}%
                  </p>
                </div>
              </div>

              {/* Wind speed indicator */}
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 mr-3">
                  <Wind size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Wind
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {weatherData.wind.speed} km/h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-day forecast section */}
      {dailyForecasts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            5-Day Forecast
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {/* Map through each day's forecast */}
            {dailyForecasts.map((day, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  {day.date}
                </p>
                <img
                  className="w-14 h-14 mx-auto my-1"
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                />
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {Math.round(day.temp)}°
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate mt-1">
                  {day.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Process the raw forecast data from OpenWeather API
 * Converts 3-hour forecasts into daily forecasts
 * Selects data point closest to noon for each day
 * @param {Object} forecastData - Raw forecast data from the API
 * @returns {Array} - Array of daily forecast objects
 */
const processForecastData = (forecastData) => {
  const dailyData = {};

  // Process each forecast item (every 3 hours)
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const hour = date.getHours();

    // Select data point closest to noon for each day
    if (
      !dailyData[day] ||
      Math.abs(hour - 12) < Math.abs(dailyData[day].hour - 12)
    ) {
      dailyData[day] = {
        date: day,
        temp: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        hour: hour,
      };
    }
  });

  // Convert the object to an array and return the first 5 days
  return Object.values(dailyData).slice(0, 5);
};

export default WeatherCard;
