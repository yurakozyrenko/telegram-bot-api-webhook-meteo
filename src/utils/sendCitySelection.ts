import { actions, cities } from 'src/bot/bot.constants';

function sendCitySelection() {
  const inlineKeyboard = {
    inline_keyboard: cities.map((city) => [
      { text: city, callback_data: `${actions.SELECT_CITY}:${city}` },
    ]),
  };

  return inlineKeyboard;
}

export default sendCitySelection;
