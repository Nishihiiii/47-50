import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useCart } from "~/hooks/useCart";
import { useAuth } from "~/hooks/useAuth";
import Modal from "~/components/ui/Modal"; // импорт модального окна для вывода уведомления об успешном заказе
import Button from "~/components/ui/Button"; // импорт кастомного компонента кнопки с предустановленными стилями
import apiClient from "~/services/apiClient";

interface CheckoutFormData { // описание полей формы доставки и способа оплаты
    name: string;
    phone: string;
    comment: string;
    paymentMethod: "card" | "cash";
}

export function meta() { // создаем функцию для настройки заголовка текущей вкладки браузера
  return [{ title: "Оформление заказа | Yummy Cloud" }]; 
}

export default function CheckoutPage() {
    const { items, totalAmount, clearCart } = useCart(); // извлечение позиций, общей суммы и функции очистки корзины
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false); // состояние для управления показом всплывающего окна
    const [isProcessing, setIsProcessing] = useState(false); // состояние блокировки интерфейса во время отправки заказа

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        defaultValues: { // установка базовых значений для необязательных полей и переключателей
            paymentMethod: "card",
            comment: ""
        }
    });

    const watchedName = watch("name"); // динамическое отслеживание изменений в поле имени
    const watchedPhone = watch("phone"); // динамическое отслеживание изменений в поле телефона

    useEffect(() => { // автоматическое заполнение формы, если профиль пользователя уже загружен
        if (user?.name) {
            setValue("name", user.name); // подстановка сохранённого имени пользователя в инпут формы
        }
    }, [user, setValue]);

    if (items.length === 0) { // защита от перехода на страницу оформления с пустой корзиной
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-stone-700 mb-4">Нечего оформлять</h2>
                <Link to="/menu" className="text-tom-thumb-600 hover:underline text-lg">
                    Перейти в меню
                </Link>
            </div>
        );
    }
        const onSubmit = async (data: CheckoutFormData) => { // функция-обработчик отправки формы на сервер
        setIsProcessing(true); // включение состояния отправки для блокировки элементов интерфейса

        const orderData = { // формирование структуры данных заказа, которую ожидает бэкенд на flask
            customer: { // группировка контактных данных клиента
                name: data.name,
                phone: data.phone,
                comment: data.comment,
                paymentMethod: data.paymentMethod
            },
            items: items.map(item => ({ // преобразование позиций корзины в плоскую структуру для базы данных
                id: item.menuItem.id,
                name: item.menuItem.name,
                price: item.menuItem.price,
                quantity: item.quantity
            })),
            total: totalAmount, // итоговая сумма к оплате
            userId: user ? user.uid : null // привязка id пользователя (если он авторизован)
        };

        try {
            await apiClient.post("/orders", orderData); // отправка post-запроса с данными заказа на сервер
            setIsProcessing(false);
            setIsModalOpen(true); // открытие модального окна успешного оформления заказа
        } catch (error) {
            setIsProcessing(false);
            alert("Не удалось отправить заказ. Проверьте подключение к серверу."); // вывод уведомления при сбое сетевого запроса
        }
    };

    const handleCloseModal = () => { // функция для обработки закрытия модального окна успеха
        setIsModalOpen(false);
        clearCart(); // полная очистка локальной корзины пользователя после успешного заказа
        navigate("/"); // перенаправление пользователя на главную страницу приложения
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-tom-thumb-900 mb-8 text-center">
                Оформление заказа
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-stone-700 font-medium mb-2">
                        Ваше имя *
                    </label>
                    <input
                        type="text"
                        placeholder="Иван Иванов"
                        className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"
                        {...register("name", { required: "Укажите ваше имя" })} // обязательное поле с кастомным текстом ошибки
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>} {/* вывод ошибки валидации имени */}
                </div>

                <div>
                    <label className="block text-stone-700 font-medium mb-2">
                        Телефон *
                    </label>
                    <input
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"
                        {...register("phone", { required: "Укажите номер телефона" })} // валидация обязательного ввода телефона
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>} {/* вывод ошибки валидации телефона */}
                </div>
                <div>
                    <label className="block text-stone-700 font-medium mb-2">
                        Комментарий к заказу
                    </label>
                    <textarea
                        rows={3} // установка высоты текстового поля в три строки
                        placeholder="Пожелания, аллергии..."
                        className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"
                        {...register("comment")} // регистрация необязательного текстового поля
                    />
                </div>

                <div>
                    <label className="block text-stone-700 font-medium mb-2">
                        Способ оплаты
                    </label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio" // использование переключателя radio-button
                                value="card"
                                className="accent-tom-thumb-600" // стилизация цвета активной точки переключателя
                                {...register("paymentMethod")} // объединение радиокнопок в одну группу через имя поля
                            />
                            Картой онлайн
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="cash"
                                className="accent-tom-thumb-600"
                                {...register("paymentMethod")}
                            />
                            Наличными
                        </label>
                    </div>
                </div>

                <div className="bg-stone-100 rounded-2xl p-5"> {/* блок серого цвета со сводным списком покупаемых товаров */}
                    <h3 className="font-bold text-stone-800 mb-3">Ваш заказ:</h3>
                    {items.map((item) => ( // итерация по позициям корзины для отображения в чеке заказа
                        <div
                            key={item.menuItem.id}
                            className="flex justify-between text-sm text-stone-600 py-1"
                        >
                            <span>
                                {item.menuItem.name} <span className="text-stone-400">x{item.quantity}</span>
                            </span>
                            <span>{item.menuItem.price * item.quantity} ₽</span> {/* промежуточный расчет цены за количество */}
                        </div>
                    ))}
                    <div className="border-t border-stone-300 mt-3 pt-3 flex justify-between font-bold text-lg">
                        <span>Итого:</span>
                        <span className="text-tom-thumb-700">{totalAmount} ₽</span> {/* вывод окончательной суммы к оплате */}
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isProcessing} // блокировка кликов на время обработки платежа/запроса на сервере
                    className="w-full py-4 text-lg"
                >
                    {isProcessing ? "Обработка платежа..." : "Оплатить заказ"} {/* динамическая смена надписи при отправке */}
                </Button>
            </form>
        <Modal
            isOpen={isModalOpen} // передача состояния видимости окна (открыто/закрыто)
            onClose={handleCloseModal} // привязка функции закрытия при клике на крестик или подложку
            title="Заказ оформлен!" // заголовок всплывающего окна
        >
            <div className="text-center py-4">
                <p className="text-lg text-stone-700 mb-2">
                    Спасибо, {watchedName}! {/* динамический вывод имени из отслеживаемого инпута формы */}
                </p>
                <p className="text-stone-500 mb-6">
                    Ваш заказ на сумму {totalAmount} ₽ принят. <br />
                    Мы свяжемся с вами по телефону {watchedPhone}. {/* динамический вывод введенного номера телефона */}
                </p>
                <Button onClick={handleCloseModal} className="w-full"> {/* кнопка завершения процесса заказа */}
                    На главную
                </Button>
            </div>
        </Modal>
    </div>
);
}
