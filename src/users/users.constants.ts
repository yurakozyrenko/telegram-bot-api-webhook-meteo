export enum UserActions {
  START = '/start',
  INFO = '/info',
  WEATHER = 'Получить погоду',
}

export enum UserState {
  START = 'start',
  EDIT = 'edit',
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
  INFO: 'INFO',
  MENU_SELECTION: 'Пожалуйста, выберите из меню: ',
  MENU_WEATHER: 'Получить погоду',

  CITY_SELECTION: 'Пожалуйста, введите название вашего города: ',
  CITY_CONFIRMED: 'Ваш город настроен на: ',
  TIME_SELECTION: 'Выберите время для ежедневной рассылки: ',
  TIME_CONFIRMED: 'Время для ежедневной рассылки установлено на: ',
  EDIT_CITY: 'Выберите новый город для ежедневной рассылки: ',
  ALREADY_SAVED: 'Ваши данные уже сохранены. Хотите изменить город или время? Используйте команду /edit.',
  FILL_CITY_FIRST: 'Заполните поле выбора /edit_city города',
  FILL_TIME_FIRST: 'Заполните поле выбора /edit_time времени',
  DEFAULT: 'Привет, я умею отправлять погоду, /edit_city введи город и /edit_time время',
};
