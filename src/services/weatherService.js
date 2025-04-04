import axios from 'axios';

// API configuration for OpenWeatherMap
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherService = {
    // Check if API key is configured in environment variables
    isApiKeyAvailable: () => !!API_KEY,

    // Fetch current weather data for a specific city
    getCurrentWeather: async (city) => {
        try {
            const response = await axios.get(
                `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            return response.data;
        } catch (error) {
            // Handle network errors
            if (!error.response) {
                throw new Error('Network error. Please check your connection.');
            }

            // Handle specific API error codes with user-friendly messages
            if (error.response.status === 404) {
                throw new Error('City not found. Please try another location.');
            } else if (error.response.status === 401) {
                throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
            }

            throw new Error('Failed to fetch weather data. Please try again.');
        }
    },

    // Fetch current weather data using geographic coordinates
    getCurrentWeatherByCoords: async (lat, lon) => {
        try {
            const response = await axios.get(
                `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('Network error. Please check your connection.');
            }

            throw new Error('Failed to fetch weather data for your location.');
        }
    },

    // Fetch 5-day forecast data for a specific city
    getForecast: async (city) => {
        try {
            const response = await axios.get(
                `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
            );
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('Network error. Please check your connection.');
            }

            throw new Error('Failed to fetch forecast data.');
        }
    },

    // Fetch 5-day forecast data using geographic coordinates
    getForecastByCoords: async (lat, lon) => {
        try {
            const response = await axios.get(
                `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('Network error. Please check your connection.');
            }

            throw new Error('Failed to fetch forecast data for your location.');
        }
    },

    // Convenience method to fetch both current weather and forecast in one call
    getWeatherAndForecast: async (city) => {
        try {
            const weatherData = await weatherService.getCurrentWeather(city);
            const forecastData = await weatherService.getForecast(city);
            return { weatherData, forecastData };
        } catch (error) {
            throw error;
        }
    },

    // Convenience method to fetch both current weather and forecast by coordinates
    getWeatherByCoords: async (lat, lon) => {
        try {
            const weatherData = await weatherService.getCurrentWeatherByCoords(lat, lon);
            const forecastData = await weatherService.getForecastByCoords(lat, lon);
            return { weatherData, forecastData };
        } catch (error) {
            throw error;
        }
    }
};

export default weatherService; 