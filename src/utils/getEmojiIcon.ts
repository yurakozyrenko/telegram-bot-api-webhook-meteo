import { WEATHERTYPE } from './consts';

function getEmojiIcon(weatherType: number): string {
  for (const key of Object.keys(WEATHERTYPE) as Array<keyof typeof WEATHERTYPE>) {
    if (weatherType >= WEATHERTYPE[key].min && weatherType <= WEATHERTYPE[key].max) {
      return WEATHERTYPE[key].emoji;
    }
  }
}

export default getEmojiIcon;
