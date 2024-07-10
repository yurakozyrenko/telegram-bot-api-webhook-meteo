import { WEATHER } from './consts';
import getEmojiIcon from './getEmojiIcon';
import { WeatherData } from './interfaces';

const getMeteoData = (data: WeatherData): string => {
  const weatherType = data.weather[0].id;

  const temperature = data.main.temp;

  const emojiIcon = getEmojiIcon(weatherType);

  return `${emojiIcon} ${temperature} ${WEATHER.TEMPERATURE_UNIT}`;
};

export default getMeteoData;
