import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import apiClient from "~/services/apiClient";

interface OrderItem { // описание структуры данных для конкретного блюда внутри заказа
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface Order { // описание полной структуры объекта заказа, получаемого с бэкенда
    id: string;
    status: string;
    total: number;
    created_at?: string;
    items: OrderItem[];
}

export function meta() {
    return [{ title: "История заказов | HATK" }];
}

export default function OrdersPage() {
    // извлечение данных сессии с переименованием загрузки в authLoading для избежания конфликтов имен
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]); // состояние для хранения списка заказов
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading || !user) return; // прерывание эффекта, если загрузка авторизации идет или пользователь не вошел

        const fetchOrders = async () => { // объявление асинхронной функции запроса данных
            try {
                const response = await apiClient.get("/orders", {
                    params: { userId: user.uid } // передача query-параметра для фильтрации заказов на стороне бэкенда
                });
                setOrders(response.data); // сохранение массива заказов в состояние
            } catch (error) {
                console.error("Ошибка при загрузке заказов:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders(); // запуск выполнения запроса
    }, [user, authLoading]); // перезапуск эффекта при изменении данных пользователя или статуса авторизации

    if (authLoading || (user && isLoading)) {
        return <div className="text-center py-20 text-stone-500">Загрузка истории заказов...</div>;
    }

    if (!user) { // обработка случая, когда неавторизованный пользователь пытается просмотреть страницу
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-stone-700 mb-4">История заказов недоступна</h2>
                <p className="text-stone-500 mb-6">Чтобы просматривать свои заказы, необходимо войти в аккаунт.</p>
                <Link to="/auth" className="inline-block bg-tom-thumb-800 text-white px-6 py-3 rounded-xl hover:bg-tom-thumb-700 transition-colors">
                    Войти в профиль
                </Link>
            </div>
        );
    }
    if (orders.length === 0) { // отображение заглушки, если у пользователя еще нет ни одного заказа
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-stone-700 mb-4">Вы еще не делали заказов</h2>
                <Link to="/menu" className="text-tom-thumb-600 hover:underline text-lg">
                    Перейти в меню и заказать
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-tom-thumb-900 mb-8 text-center">Мои заказы</h1>

            <div className="space-y-6">
                {orders.map((order) => ( // итерация по массиву полученных заказов для рендеринга карточек
                    <div key={order.id} className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-stone-50 px-5 py-4 border-b border-stone-200 flex justify-between items-center flex-wrap gap-2">
                            <div>
                                <span className="text-xs font-mono text-stone-400 block mb-0.5">ID: {order.id}</span>
                                <span className="text-sm font-medium text-stone-600">
                                    {order.created_at ? new Date(order.created_at).toLocaleDateString("ru-RU", { // преобразование строки даты в красивый локализованный формат
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }) : "Дата не указана"}
                                </span>
                            </div>
                            <span className="bg-tom-thumb-100 text-tom-thumb-800 text-xs font-semibold px-3 py-1 rounded-full">
                                {order.status} {/* вывод текущего статуса обработки заказа */}
                            </span>
                        </div>

                        <div className="p-5 space-y-2">
                            {order.items.map((item, idx) => ( // перебор списка блюд, входящих в конкретный заказ
                                <div key={item.id || idx} className="flex justify-between text-sm text-stone-600">
                                    <span>{item.name} <span className="text-stone-400">x{item.quantity}</span></span> {/* название блюда и его количество */}
                                    <span>{item.price * item.quantity} ₽</span> {/* подсчет стоимости за позицию */}
                                </div>
                            ))}
                        </div>

                        <div className="bg-stone-50/50 px-5 py-4 border-t border-stone-100 flex justify-between items-center font-bold text-lg">
                            <span className="text-stone-700 text-base">Итого:</span>
                            <span className="text-tom-thumb-700">{order.total} ₽</span> {/* вывод итоговой суммы заказа */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
