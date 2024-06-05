import { WeatherType } from './consts';

function getEmojiIcon(weatherType: number): string {
  for (const key of Object.keys(WeatherType) as Array<keyof typeof WeatherType>) {
    if (weatherType >= WeatherType[key].min && weatherType <= WeatherType[key].max) {
      return WeatherType[key].emoji;
    }
  }
}

export default getEmojiIcon;
