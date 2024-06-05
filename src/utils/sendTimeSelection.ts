import { actions, times } from '../bot/bot.constants';

function sendTimeSelection() {
  const inlineKeyboard = {
    inline_keyboard: times.map((time) => [{ text: time, callback_data: `${actions.SELECT_TIME}:${time}` }]),
  };
  return inlineKeyboard;
}

export default sendTimeSelection;
