import axios from 'axios';

import getEmojiIcon from './getEmojiIcon';

async function getMeteoData(message: string): Promise<string> {
  try {
    const cityName = encodeURIComponent(message);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&&units=metric&&appid=${process.env.API_KEY}`;

    const { data } = await axios.get(url);

    const weatherType = data.weather[0].id;

    const temtemperature = data.main.temp;

    const emojiIcon = getEmojiIcon(weatherType);

    return `Погода ${message} ${emojiIcon} ${temtemperature} град C`;
  } catch (error) {
    return `Ошибка при получении данных о погоде в городе ${message}`;
  }
}

export default getMeteoData;
