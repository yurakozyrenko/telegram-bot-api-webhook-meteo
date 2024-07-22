import { WEATHER } from './consts';
import getEmojiIcon from './getEmojiIcon';
import { IWeatherData } from './interfaces';

const getMeteoData = (data: IWeatherData, city: string): string => {
  const weatherType = data.weather[0].id;

  const temperature = data.main.temp;

  const emojiIcon = getEmojiIcon(weatherType);

  return `${city} ${emojiIcon} ${temperature} ${WEATHER.TEMPERATURE_UNIT}`;
};

export default getMeteoData;
