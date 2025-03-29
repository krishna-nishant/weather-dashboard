import { useState } from 'react'
import axios from 'axios'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

  const fetchWeather = async (city) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      )
      setWeatherData(response.data)
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('City not found. Please try another location.')
      } else {
        setError('Failed to fetch weather data. Please try again.')
      }
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex justify-center items-center p-5">
      <div className="w-full max-w-md bg-white/90 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Weather Dashboard</h1>
        <SearchBar onSearch={fetchWeather} />
        <WeatherCard 
          weatherData={weatherData} 
          loading={loading} 
          error={error} 
        />
      </div>
    </div>
  )
}

export default App
