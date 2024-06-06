import { times } from '../bot/bot.constants';

function sendTimeSelection() {
  const keyboard = times.map((time) => [{ text: time }]);

  return keyboard;
}

export default sendTimeSelection;
