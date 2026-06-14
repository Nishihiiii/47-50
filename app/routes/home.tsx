import { Link } from "react-router"; // импортируем компонент ссылки для перехода между страницами без перезагрузки
import { restaurantInfo } from "~/data/restaurant"; // импортируем готовый объект с общей информацией о нашем ресторане

export function meta() { // создаем специальную функцию для управления метатегами текущей страницы
  return [{ title: "Yummy Cloud" }]; 
}

export default function HomePage() { // создаем основную функцию для отображения содержимого главной страницы
  return (
    <div className="text-center space-y-8"> 
      <h1 className="text-5xl font-bold text-tom-thumb-900 mt-12"> 
        {restaurantInfo.name} 
      </h1>
      <p className="text-xl text-tom-thumb-700 max-w-2xl mx-auto">
        Новая культура комфорт-фуда в самом центре города. 
      </p>
      <Link
        to="/menu" // прописываем путь для быстрого перехода на внутреннюю страницу с каталогом блюд
        className="inline-block bg-tom-thumb-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-tom-thumb-700 transition-colors"
      >
        Смотреть меню 
      </Link>
    </div>
  );
}
