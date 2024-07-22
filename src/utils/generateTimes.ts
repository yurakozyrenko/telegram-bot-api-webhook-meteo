import { Times } from '../users/users.constants';

export default function generateTime() {
  const times = Object.values(Times) as string[];
  const timeButtons = times.map((time) => [{ text: time }]);
  const keyboard = [...timeButtons];
  return keyboard;
}
