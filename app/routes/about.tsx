import { restaurantInfo } from "~/data/restaurant"; // импортируем объект с базовыми данными ресторана
import restaurantImage from "~/assets/restaurant.avif"; // импортируем файл с главной фотографией интерьера заведения

export function meta() { // создаем специальную функцию для управления метатегами страницы
    return [{ title: "О нас | Yummy Cloud" }]; // задаем текстовое название, которое будет отображаться на вкладке вверху браузера
}

export default function AboutPage() { // создаем основную функцию для отображения всей страницы "о нас"
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <section className="bg-tom-thumb-50 rounded-3xl p-8 shadow-sm">
                <h1 className="text-4xl font-bold text-tom-thumb-900 mb-4">О нас</h1>
                <p className="text-lg text-tom-thumb-700 leading-relaxed">
                   Yummy Cloud — это современный городской ресторан, который переосмысляет концепцию понятной и сытной кухни. Мы отказались от микропорций и сложных ресторанных экспериментов в пользу чистого, насыщенного вкуса и абсолютного гастрономического комфорта.
                </p>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-tom-thumb-900 mb-3">Наши преимущества</h2>
                    <ul className="space-y-3 text-tom-thumb-700">
                        <li>Строгий отбор ингредиентов и уникальные соусы</li>
                        <li>Профессиональная команда и персональный подход</li>
                        <li>Удобная премиум-точка на карте мегаполиса</li>
                        <li>Особый уют и кинематографичный вечерний вайб</li>
                    </ul>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm flex items-center justify-center">
                    <img
                        src={restaurantImage}
                        alt="Ресторан Yummy Cloud"
                        className="w-full h-auto rounded-2xl object-cover"
                    />
                </div>
            </section>
        </div>
    );
}
