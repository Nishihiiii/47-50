import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router"; // импорт служебных компонентов маршрутизатора для управления метатегами, скриптами и переходами
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { AuthProvider } from "~/hooks/useAuth";
import { CartProvider } from "~/hooks/useCart";
import "./app.css"; // импорт глобальных стилей (включая tailwind)

export default function RootLayout() { // главный каркас, оборачивающий все страницы приложения
    return (
        <html lang="ru">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta /> {/* рендеринг индивидуальных метатегов конкретной активной страницы */}
                <Links /> {/* автоматическое подключение стилей и линков активной страницы */}
            </head>
            <body>
                <AuthProvider> {/* глобальное обеспечение всех страниц контекстом авторизации */}
                    <CartProvider> {/* глобальное обеспечение всех страниц контекстом корзины */}
                        <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
                            <Header />
                            <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
                                <Outlet /> {/* точка рендеринга контента текущего активного маршрута */}
                            </main>
                            <Footer />
                        </div>
                    </CartProvider>
                </AuthProvider>

                <ScrollRestoration /> {/* автоматический сброс прокрутки страницы вверх при переходах */}
                <Scripts /> {/* внедрение необходимых клиентских js-скриптов сборщика */}
            </body>
        </html>
    );
}
