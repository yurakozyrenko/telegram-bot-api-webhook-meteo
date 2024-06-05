export enum Messages {
  START = 'Welcome!',
  INFO = 'INFO',
  CITY_SELECTION = 'Пожалуйста, введите название вашего города: ',
  CITY_CONFIRMED = 'Ваш город настроен на: ',
  TIME_SELECTION = 'Выберите время для ежедневной рассылки: ',
  TIME_CONFIRMED = 'Время для ежедневной рассылки установлено на: ',
  EDIT_CITY = 'Выберите новый город для ежедневной рассылки: ',
}

export enum Actions {
  START = '/start',
  INFO = '/info',
  EDIT = '/edit',
  SELECT_CITY = 'select_city',
  SELECT_TIME = 'select_time',
}

export const cities = ['Минск', 'Гродно', 'Брест', 'Могилёв', 'Витебск', 'Гомель'];

export const times = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
