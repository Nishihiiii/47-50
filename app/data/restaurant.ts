import type { RestaurantInfo } from "~/types"; // импортируем строгое описание структуры (тип) данных для информации о ресторане

export const restaurantInfo: RestaurantInfo = { // создаем и экспортируем объект, в котором хранятся все главные контакты заведения
  name: "Yummy Cloud",
  address: "ул. Светлая, 24",
  phone: "+7 (999) 123-45-67",
  workHours: "Пн-Вс: 12:00 - 23:00",
};
