
import { restaurantInfo } from "~/data/restaurant"; // импортируем объект с данными ресторана из файла с информацией

export default function Footer() { // создаем функцию компонента для подвала сайта
  return (
    <footer className="bg-tom-thumb-700 text-tom-thumb-100 py-8 mt-12"> 
      <div className="max-w-6xl mx-auto px-4 text-center"> 
        <p className="text-lg font-serif text-white mb-2">{restaurantInfo.name}</p> {/* выводим название ресторана крупным белым шрифтом с засечками */}
        <p>{restaurantInfo.address}</p>  {/* отображаем физический адрес ресторана */}
        <p>{restaurantInfo.phone}</p>  {/* выводим контактный номер телефона */}
        <p>{restaurantInfo.workHours}</p> {/* показываем график и часы работы */}
      </div>
    </footer>
  );
}
