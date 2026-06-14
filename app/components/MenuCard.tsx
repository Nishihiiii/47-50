import type { MenuItem } from "~/types"; // импортируем описание типа данных для одного блюда из папки проекта

interface Props {
  item: MenuItem; // сам объект блюда со всей информацией о нем (название, цена, картинка)
  onAddToCart: (item: MenuItem) => void; // функция, которая будет добавлять это блюдо в общую корзину
}

export default function MenuCard({ item, onAddToCart }: Props) { // создаем функцию компонента карточки и принимаем нужные свойства
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={item.image} // подгружаем картинку конкретного блюда
        alt={item.name} // пишем название блюда в альтернативный текст на случай сбоя картинки
        className="w-full h-48 object-cover" // растягиваем картинку по ширине, задаем фиксированную высоту и подгоняем масштаб без искажений
      />
      <div className="p-5">
        <div className="flex justify-between items-start mb-2"> 
          <h3 className="font-bold text-lg">{item.name}</h3> {/* выводим название блюда крупным жирным шрифтом */}
          <span className="text-tom-thumb-700 font-bold">{item.price} ₽</span> {/* показываем цену блюда ярким цветом со значком рубля */}
        </div>
        <p className="text-sm text-stone-500 mb-4">{item.description}</p> {/* выводим небольшое описание состава или рецепта блюда серым цветом */}
        <button
          onClick={() => onAddToCart(item)} // при клике на кнопку вызываем функцию добавления именно этого товара в корзину
          className="w-full bg-tom-thumb-600 text-white py-2 rounded-xl hover:bg-tom-thumb-700 transition-colors" // широкая зеленая кнопка, которая плавно темнеет при наведении мышки
        >
          В корзину
        </button>
      </div>
    </div>
  );
}
