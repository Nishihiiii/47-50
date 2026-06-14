import { Link } from "react-router"; // импортируем компонент ссылки для перемещения по страницам без перезагрузки
import { useCart } from "~/hooks/useCart"; // импортируем наш собственный хук, чтобы управлять товарами в корзине

export function meta() { // создаем функцию для управления метаданными текущей страницы
  return [{ title: "Корзина | Yummy Cloud" }];
}

export default function CartPage() { // создаем основную функцию для отображения всей страницы корзины
  const { items, totalAmount, updateQuantity } = useCart(); // достаем из нашего хука список товаров, общую сумму и функцию изменения количества

  if (items.length === 0) { // если в массиве товаров ничего нет (длина равна нулю)
    return ( // то вместо списка товаров возвращаем простую заглушку о том, что корзина пустая
      <div className="text-center py-20"> 
        <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2> 
        <Link to="/menu" className="text-tom-thumb-600 hover:underline text-lg"> 
          Перейти в меню 
        </Link>
      </div>
    );
  }

  return ( // если товары в корзине все-таки есть, возвращаем основную разметку страницы
    <div className="max-w-2xl mx-auto"> 
      <h1 className="text-3xl font-bold text-tom-thumb-900 mb-8">Корзина</h1> 

      {items.map((item) => (
        <div key={item.menuItem.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm flex items-center gap-4"> 
                    <img src={item.menuItem.image} alt={item.menuItem.name} className="w-20 h-20 object-cover rounded-lg" /> 
                    <div className="flex-grow"> 
                        <h3 className="font-bold">{item.menuItem.name}</h3> 
                        <p className="text-tom-thumb-700">{item.menuItem.price} ₽</p> 
                    </div>
                    <div className="flex items-center gap-2"> 
                        <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)} // вешаем на клик функцию уменьшения количества этого товара на единицу
                        className="w-8 h-8 bg-stone-200 rounded-full" // задаем кнопке минуса круглую форму и серый фоновый цвет
                        >
                        - 
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span> 
                        <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)} // вешаем на клик функцию увеличения количества этого товара на единицу
                        className="w-8 h-8 bg-stone-200 rounded-full" // задаем кнопке плюса точно такую же круглую форму и серый цвет
                        >
                        + 
                        </button>

                    </div>
                </div>
            ))}

      <div className="bg-stone-100 rounded-xl p-6 mt-6"> 
        <div className="flex justify-between text-xl font-bold mb-4"> 
          <span>Итого:</span> 
          <span>{totalAmount} ₽</span> 
        </div>
        <Link
          to="/checkout" // указывает путь для перехода на страницу оформления и подтверждения заказа
          className="block text-center w-full bg-tom-thumb-600 text-white py-3 rounded-xl text-lg hover:bg-tom-thumb-700 transition-colors" 
        >
          Оформить заказ
        </Link>
      </div>
    </div> 
  );
}
