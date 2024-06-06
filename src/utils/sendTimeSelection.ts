import { times } from '../bot/bot.constants';
import { UserActions } from '../users/users.constants';

function sendTimeSelection() {
  const inlineKeyboard = {
    inline_keyboard: times.map((time) => [{ text: time, callback_data: `${UserActions.SELECT_TIME}:${time}` }]),
  };
  return inlineKeyboard;
}

export default sendTimeSelection;
