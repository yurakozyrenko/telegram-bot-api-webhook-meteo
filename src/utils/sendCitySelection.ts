import { cities } from '../bot/bot.constants';
import { UserActions } from '../users/users.constants';

function sendCitySelection() {
  const keyboard = cities.map((city) => [{ text: city }]);

  return keyboard;
}

export default sendCitySelection;
