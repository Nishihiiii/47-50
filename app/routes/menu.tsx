import { useState, useEffect } from "react";
import MenuCard from "~/components/MenuCard";
import { useCart } from "~/hooks/useCart"; // импорт кастомного хука для работы с корзиной
import type { MenuItem } from "~/types"; // импорт описания типа данных для элемента меню
import apiClient from "~/services/apiClient";

export function meta() { 
  return [{ title: "Меню | Yummy Cloud" }]; 
}

export default function MenuPage() {
    const categories = ["Все", "Закуски", "Основные блюда", "Десерты", "Напитки"]; // список доступных категорий для фильтрации
    const [activeCategory, setActiveCategory] = useState("Все"); // состояние для хранения выбранной категории
    const { totalCount, addItem } = useCart(); // извлечение количества товаров и функции добавления из корзины

    const [menuData, setMenuData] = useState<MenuItem[]>([]); // состояние для хранения списка блюд из бэкенда
    const [isLoading, setIsLoading] = useState(true); // состояние индикатора загрузки данных
    const [error, setError] = useState<string | null>(null); // состояние для хранения текста ошибки

    useEffect(() => { // хук для выполнения запроса к api при монтировании страницы
        apiClient.get<MenuItem[]>('/menu') // запрос на получение списка блюд
            .then((response) => {
                setMenuData(response.data); // сохранение полученных блюд в состояние
            })
            .catch((err) => {
                // запись текста ошибки с бэкенда или резервного сообщения
                setError(err?.response?.data?.message || err.message || "Не удалось загрузить меню");
            })
            .finally(() => {
                setIsLoading(false); // выключение индикатора загрузки в любом случае
            });
    }, []); // пустой массив зависимостей означает однократный запуск

    const filteredMenu = activeCategory === "Все" // фильтрация списка блюд на основе выбранной категории
        ? menuData // если выбрано "Все", отображаются все блюда
        : menuData.filter(item => item.category === activeCategory); // иначе только блюда с совпадающей категорией

    const addToCart = (item: MenuItem) => { // функция-обёртка для добавления блюда в корзину
        addItem(item);
    };

    if (isLoading) {
        return <div className="text-center py-20 text-xl font-medium text-stone-500">Загрузка меню...</div>; // отображение экрана загрузки
    }

    if (error) {
        return <div className="text-center py-20 text-xl font-medium text-red-500">Ошибка: {error}</div>; // отображение экрана ошибки
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-stone-900">Меню</h1>
                <span className="bg-tom-thumb-100 text-tom-thumb-800 px-4 py-2 rounded-full">
                    {totalCount} {/* вывод текущего количества товаров в корзине */}
                </span>
            </div>
                    <div className="flex gap-3 mb-8 flex-wrap">
            {categories.map(cat => ( // перебор и отрисовка кнопок для каждой категории из массива
                <button
                    key={cat} // уникальный ключ для корректной работы виртуального дома react
                    onClick={() => setActiveCategory(cat)} // обновление активной категории при клике на кнопку
                    className={`px-5 py-2 rounded-full border transition-colors ${activeCategory === cat
                        ? "bg-tom-thumb-600 text-white border-tom-thumb-600" // стили для активной (выбранной) кнопки
                        : "bg-white text-tom-thumb-800 border-tom-thumb-200 hover:bg-tom-thumb-50" // стили для неактивных кнопок
                    }`}
                >
                    {cat} {/* вывод названия категории на кнопке */}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* адаптивная сетка для карточек блюд */}
            {filteredMenu.map(item => ( // перебор и рендеринг только отфильтрованных блюд
                <MenuCard key={item.id} item={item} onAddToCart={addToCart} /> // передача данных блюда и функции добавления в компонент карточки
            ))}
        </div>
    </div>
);
}
