export const cronTimezone = 'Europe/Moscow';

export const WEATHER_TYPE = {
  THUNDERSTORM: { min: 200, max: 232, emoji: '⚡' },
  DRIZZLE: { min: 300, max: 321, emoji: '🌧️' },
  RAIN: { min: 500, max: 531, emoji: '☔' },
  SNOW: { min: 600, max: 622, emoji: '❄️' },
  ATMOSPHERE: { min: 701, max: 781, emoji: '🌫️' },
  CLOUDS: { min: 801, max: 804, emoji: '⛅' },
  CLEAR: { min: 800, max: 800, emoji: '☀️' },
};

export const API_WEATHER = {
  BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
  UNITS: 'metric',
};

export const WEATHER = {
  TEMPERATURE_UNIT: 'град C',
  WEATHER_DATA_ERROR: `Ошибка при получении данных о погоде в городе`,
};
