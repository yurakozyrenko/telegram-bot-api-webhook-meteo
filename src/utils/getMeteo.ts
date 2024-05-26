import axios from 'axios';

async function getMeteoData(message: string): Promise<string> {
  try {
    const cityName = encodeURIComponent(message);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&&units=metric&&appid=${process.env.API_KEY}`;

    const { data } = await axios.get(url);

    const weatherType = data.weather[0].id;
    const temtemperature = data.main.temp;

    let emojiIcon = '';

    if (weatherType >= 200 && weatherType <= 232) emojiIcon = '⚡';
    else if (weatherType >= 300 && weatherType <= 321) emojiIcon = '🌧️';
    else if (weatherType >= 500 && weatherType <= 531) emojiIcon = '☔';
    else if (weatherType >= 600 && weatherType <= 622) emojiIcon = '❄️';
    else if (weatherType >= 701 && weatherType <= 781) emojiIcon = '🌫️';
    else if (weatherType >= 801 && weatherType <= 804) emojiIcon = '⛅';
    else if (weatherType == 800) emojiIcon = '☀️';

    return `Погода ${message} ${emojiIcon} ${temtemperature} град C`;
  } catch (error) {
    return `Ошибка при получении данных о погоде в городе ${message}`;
  }
}

export default getMeteoData;
