export enum UserActions {
  START = '/start',
  INFO = '/info',
  EDIT_CITY = '/edit_city',
  EDIT_TIME = '/edit_time',
  SELECT_CITY = 'select_city',
  SELECT_TIME = 'select_time',
}

export enum UserState {
  START = 'start',
  EDIT = 'edit',
  WAITING_FOR_APPROVE_CITY = 'waitingForApproveCity',
  WAITING_FOR_APPROVE_TIME = 'waitingForApproveTime',
}

export const messages = {
  START: 'Welcome!',
  INFO: 'INFO',
  CITY_SELECTION: 'Пожалуйста, введите название вашего города: ',
  CITY_CONFIRMED: 'Ваш город настроен на: ',
  TIME_SELECTION: 'Выберите время для ежедневной рассылки: ',
  TIME_CONFIRMED: 'Время для ежедневной рассылки установлено на: ',
  EDIT_CITY: 'Выберите новый город для ежедневной рассылки: ',
  ALREADY_SAVED: 'Ваши данные уже сохранены. Хотите изменить город или время? Используйте команду /edit.',
  FILL_CITY_TIME_FIRST: 'Заполните сначала поля выбора города и время',
  DEFAULT: 'Привет, я умею отправлять погоду',
};
