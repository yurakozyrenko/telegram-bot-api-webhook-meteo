import axios from 'axios';

import { WEATHER } from './consts';
import getEmojiIcon from './getEmojiIcon';
import { IGetMeteoData } from './interfaces';

async function getMeteoData({ city, url }: IGetMeteoData): Promise<string> {
  try {
    const { data } = await axios.get(url);

    const weatherType = data.weather[0].id;

    const temperature = data.main.temp;

    const emojiIcon = getEmojiIcon(weatherType);

    return `${city} ${emojiIcon} ${temperature} ${WEATHER.TEMPERATURE_UNIT}`;
  } catch (error) {
    return `${WEATHER.WEATHER_DATA_ERROR} ${city}`;
  }
}

export default getMeteoData;
