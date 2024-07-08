import { WEATHER_TYPE } from './consts';

function getEmojiIcon(weatherType: number): string {
  for (const key of Object.keys(WEATHER_TYPE) as Array<keyof typeof WEATHER_TYPE>) {
    if (weatherType >= WEATHER_TYPE[key].min && weatherType <= WEATHER_TYPE[key].max) {
      return WEATHER_TYPE[key].emoji;
    }
  }
}

export default getEmojiIcon;
