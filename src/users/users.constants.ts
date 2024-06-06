export enum UserActions {
  START = '/start',
  INFO = '/info',
  EDIT_CITY = '/edit_city',
  EDIT_TIME = '/edit_time',
}

export enum UserState {
  START = 'start',
  EDIT = 'edit',
  WAITING_FOR_APPROVE_CITY = 'waitingForApproveCity',
  WAITING_FOR_APPROVE_TIME = 'waitingForApproveTime',
}

export const messages = {
  START: 'Welcome! я умею отправлять погоду',
  INFO: 'INFO',
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
