# Weather Dashboard

A modern, responsive weather dashboard application built with React.js that allows users to search for weather information for any city worldwide.

[Live Demo](https://weather-dashboard-zynatic.vercel.app/)

## Features

- **City Search with Smart Suggestions**: Search for any city with intelligent autocomplete that works with partial typing
- **Current Weather**: Display current temperature, conditions, humidity, and wind speed
- **Geolocation**: Get weather for your current location with one click
- **5-Day Forecast**: View weather trends for the next 5 days
- **Recent Searches**: Quick access to your last 5 searched cities
- **Dark/Light Theme**: Toggle between dark and light mode based on your preference
- **Responsive Design**: Works perfectly on both mobile and desktop
- **Instant Refresh**: Refresh weather data for the current city
- **Error Handling**: User-friendly error messages for invalid cities or API issues

## Smart City Suggestions

The application features an advanced city search system with:

- **Intelligent Autocomplete**: Starts showing suggestions as you type (min. 2 characters)
- **Prioritized Results**: Major cities appear first in suggestions
- **Keyboard Navigation**: Use arrow keys to navigate suggestions, Enter to select
- **Search Highlighting**: Matching text is highlighted in blue
- **Location Context**: Each suggestion shows state/region information
- **Geographic Coordinates**: Each suggestion includes latitude/longitude coordinates

## Tech Stack

- **Framework**: React.js with Vite
- **State Management**: React Hooks
- **Styling**: TailwindCSS with custom animations
- **API Communication**: Axios
- **UI Icons**: Lucide React
- **Geolocation API**: Browser's native Geolocation API
- **Suggestions API**: GeoNames Geographic Database

## Setup Instructions

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/krishna-nishant/weather-dashboard.git
   cd weather-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a .env file in the root directory with your API keys:
   ```
   VITE_WEATHER_API_KEY=your_openweathermap_api_key
   VITE_GEONAMES_USERNAME=your_geonames_username
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Build for production:
   ```
   npm run build
   ```

## API Integration

This project uses two external APIs:

### OpenWeatherMap API
Used to fetch weather data:
- Current Weather API: https://api.openweathermap.org/data/2.5/weather
- 5-Day Forecast API: https://api.openweathermap.org/data/2.5/forecast

### GeoNames API
Used for city search suggestions:
- Search API: https://secure.geonames.org/searchJSON
- Documentation: http://www.geonames.org/export/geonames-search.html

### API Keys

- You need to register for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
- You need to register for a free username at [GeoNames](http://www.geonames.org/login)

## Project Structure

```
weather-dashboard/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and data services
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
├── .env                  # Environment variables (git-ignored)
└── README.md             # Project documentation
```

## Key Implementation Notes

- **City Suggestion Service**: The application uses a combination of API calls and local data to provide robust city suggestions even when offline
- **Debounced Search**: API calls for suggestions are debounced to prevent excessive requests
- **Accessibility**: The search component includes proper ARIA attributes for screen readers
- **Error Resilience**: Multiple fallback mechanisms ensure the app works even when APIs fail

## Deployment

The project is deployed on Vercel. The deployment process is automatic through GitHub integration.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- City suggestion data provided by [GeoNames](http://www.geonames.org/)
- Icons by [Lucide](https://lucide.dev/)