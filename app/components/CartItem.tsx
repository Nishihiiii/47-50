import type { CartItem as CartItemType } from "~/types"; // импортируем тип для товара в корзине из папки с типами

interface CartItemProps {
  item: CartItemType; // сам объект товара, который лежит в корзине
  onUpdateQuantity: (id: number, quantity: number) => void; // функция для изменения количества этого товара
}

export default function CartItem({ item, onUpdateQuantity }: CartItemProps) { // создаем функцию компонента и принимаем его свойства
  const { menuItem, quantity } = item; // достаем данные о самом блюде и его текущее количество из объекта товара

  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"> {/* белая карточка товара с отступами, скруглением и тенью */}
      <img
        src={menuItem.image} // берем ссылку на картинку блюда
        alt={menuItem.name} // задаем альтернативный текст с названием на случай, если картинка не загрузится
        className="w-20 h-20 object-cover rounded-lg" // делаем картинку квадратной, скругляем углы и подгоняем размер без искажений
      />

      <div className="flex-grow"> {/* контейнер для текста, который занимает все свободное место по ширине */}
        <h3 className="font-bold text-stone-800">{menuItem.name}</h3> {/* выводим название блюда жирным темным шрифтом */}
        <p className="text-tom-thumb-700 font-medium"> {/* строчка со стоимостью товара */}
          {menuItem.price} ₽ ✕ {quantity} = {menuItem.price * quantity} ₽ {/* выводим цену, количество и автоматически считаем общую сумму */}
        </p>
      </div>

      <div className="flex items-center gap-2"> {/* блок с кнопками управления количеством справа */}
        <button
          onClick={() => onUpdateQuantity(menuItem.id, quantity - 1)} // при клике уменьшаем количество товара на один
          className="w-8 h-8 bg-stone-200 rounded-full hover:bg-stone-300 transition-colors flex items-center justify-center" // круглая серая кнопка со сменой цвета при наведении
        >
          - {/* значок минуса для уменьшения количества */}
        </button>
        <span className="w-8 text-center font-medium">{quantity}</span> {/* показываем текущее количество товара по центру */}
        <button
          onClick={() => onUpdateQuantity(menuItem.id, quantity + 1)} // при клике увеличиваем количество товара на один
          className="w-8 h-8 bg-stone-200 rounded-full hover:bg-stone-300 transition-colors flex items-center justify-center" // точно такая же круглая серая кнопка
        >
          + {/* значок плюса для увеличения количества */}
        </button>
      </div>
    </div>
  );
}

