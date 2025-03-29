import React from 'react';
import AppLayout from './components/layout/AppLayout';
import WeatherDashboard from './components/WeatherDashboard';

function App() {
  return (
    <AppLayout>
      <WeatherDashboard />
    </AppLayout>
  );
}

export default App;
