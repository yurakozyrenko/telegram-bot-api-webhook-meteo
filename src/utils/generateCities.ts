import { Cities } from '../users/users.constants';

export default function generateCities() {
  const times = Object.values(Cities) as string[];
  const timeButtons = times.map((city) => [{ text: city }]);
  const keyboard = [...timeButtons];
  return keyboard;
}
