import React from 'react';

const WeatherCard = ({ weatherData, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 text-center shadow">
        <h2 className="text-xl text-gray-700">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-8 text-center shadow">
        <h2 className="text-xl text-gray-700 mb-2">Error</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{weatherData.name}, {weatherData.sys.country}</h2>
        <img 
          className="w-20 h-20"
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
          alt={weatherData.weather[0].description} 
        />
      </div>
      <div>
        <div className="mb-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-1">{Math.round(weatherData.main.temp)}°C</h1>
          <p className="text-lg text-gray-600 capitalize">{weatherData.weather[0].description}</p>
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <p className="text-gray-600 py-1">Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
          <p className="text-gray-600 py-1">Humidity: {weatherData.main.humidity}%</p>
          <p className="text-gray-600 py-1">Wind: {weatherData.wind.speed} km/h</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard; 