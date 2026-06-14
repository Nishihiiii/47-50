import { createContext, useContext, useMemo, useState } from "react"; // импортируем нужные инструменты и хуки для управления состоянием из реакта
import type { ReactNode } from "react"; // импортируем тип для описания дочерних элементов внутри компонентов
import type { CartItem, MenuItem } from "~/types"; // подгружаем готовые описания типов для товаров в корзине и элементов меню

interface CartContextValue {
  items: CartItem[]; // массив со всеми товарами, которые пользователь уже положил в корзину
  totalAmount: number; // общая стоимость всех добавленных товаров в рублях
  totalCount: number; // общее количество единиц товаров в корзине
  addItem: (item: MenuItem) => void; // функция, чтобы добавить новое блюдо в корзину
  updateQuantity: (id: number, newQty: number) => void; // функция, чтобы изменить количество конкретного товара
  removeItem: (id: number) => void; // функция, чтобы полностью удалить товар из корзины
  clearCart: () => void; // функция, чтобы за один клик полностью очистить всю корзину
}

const CartContext = createContext<CartContextValue | null>(null); // создаем само облако контекста, где по умолчанию ничего не лежит (null)

export function CartProvider({ children }: { children: ReactNode }) { // создаем компонент-оболочку, который будет делиться данными корзины со всем сайтом
  const [items, setItems] = useState<CartItem[]>([]); 

  const totalAmount = useMemo( // запускаем умный подсчет общей стоимости, который пересчитывается только при изменении товаров
    () => items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0), // перебираем корзину и складываем цену каждого блюда, умноженную на его количество
    [items] 
  );

  const totalCount = useMemo( // запускаем умный подсчет общего количества предметов, чтобы показывать цифру на иконке корзины
    () => items.reduce((sum, item) => sum + item.quantity, 0), 
    [items]
  );

  const addItem = (menuItem: MenuItem) => { // создаем функцию для добавления нового блюда в корзину
    setItems((prev) => { // обновляем текущее состояние корзины, опираясь на её предыдущую версию
      const existing = prev.find((item) => item.menuItem.id === menuItem.id); // проверяем, не лежит ли уже точно такое же блюдо в нашей корзине
      if (existing) { // если такое блюдо в корзине нашлось, нам нужно просто увеличить его количество
        return prev.map((item) => // пробегаемся по всему списку товаров в корзине
          item.menuItem.id === menuItem.id // ищем совпадение по цифровому номеру блюда
            ? { ...item, quantity: item.quantity + 1 } // если нашли копируем товар и прибавляем единицу к его количеству
            : item // все остальные товары в корзине оставляем без каких-либо изменений
        );
      }
      return [...prev, { menuItem, quantity: 1 }]; // если блюдо новое  копируем старую корзину и добавляем его в конец со штучным количеством 1
    });
  };

const updateQuantity = (id: number, newQty: number) => { // создаем функцию для изменения количества товара
  setItems((prev) =>  
    prev
      .map((item) => 
        item.menuItem.id === id ? { ...item, quantity: newQty } : item // если нашли товар с нужным номером обновляем количество, остальные не трогаем
      )
      .filter((item) => item.quantity > 0)   
  );
};

const removeItem = (id: number) => {   // создаем функцию для полного удаления товара из корзины 
  setItems((prev) => prev.filter((item) => item.menuItem.id !== id)); // фильтруем массив и оставляем только те товары, чей номер не совпадает с удаляемым
};

const clearCart = () => {   // создаем функцию для полной очистки всей корзины сразу
  setItems([]); // просто сбрасываем состояние списка товаров обратно в пустой массив
};

return (
  <CartContext.Provider  // открываем специальный компонент-передатчик, который "раздает" данные вниз по проекту
    value={{ items, totalAmount, totalCount, addItem, updateQuantity, removeItem, clearCart }} // передаем в этот провайдер абсолютно все переменные и функции корзины
  >
    {children}                          
  </CartContext.Provider>  
);
};

export function useCart() {   // создаем собственный удобный хук, чтобы легко брать данные корзины в любом компоненте
const context = useContext(CartContext);  
if (!context) {    
  throw new Error("useCart must be used within a CartProvider"); // если компонент вызван вне оболочки CartProvider, приложение выдаст понятную ошибку
}
return context;  // если все в порядке и данные нашлись, отдаем их компоненту, который вызвал этот хук
}
