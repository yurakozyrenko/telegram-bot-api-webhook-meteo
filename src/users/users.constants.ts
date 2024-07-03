export enum UserActions {
  START = '/start',
  WEATHER = 'Настройка получения погоды',
  SETTINGS = 'Настройки',
  WEATHER_NOW = '/weather',
  SETTINGS_NOW = '/settings',
  CANSEL = '/cansel',
}

export enum UserState {
  START = 'start',
  CITY = 'city',
  TIME = 'time',
  CONFIRM = 'confirm',
}

export enum Cities {
  Minsk = 'Минск',
  Grodno = 'Гродно',
  Brest = 'Брест',
  Mogilev = 'Могилёв',
  Vitebsk = 'Витебск',
  Gomel = 'Гомель',
}

export enum Times {
  T08_00 = '08:00',
  T10_00 = '10:00',
  T12_00 = '12:00',
  T14_00 = '14:00',
  T16_00 = '16:00',
  T18_00 = '18:00',
  T20_00 = '20:00',
  T22_00 = '22:00',
}

export const messages = {
  START: 'Привет! Добро пожаловать в нашего бота!',
  MENU_SELECTION: 'Пожалуйста, выберите из меню: ',
  MENU_WEATHER: 'Настройка получения погоды',
  MENU_SETTINGS: 'Настройки',
  MENU_CANSEL: 'Отписаться от уведомлений',

  CITY_SELECTION: 'Пожалуйста, введите название вашего города: ',
  TIME_SELECTION: 'Выберите время для ежедневной рассылки: ',
  ALREADY_SAVED: 'Ваши данные приняты.',
  DEFAULT: 'Привет, я умею отправлять погоду.',
};
