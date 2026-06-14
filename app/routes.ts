import { type RouteConfig, index, route } from "@react-router/dev/routes"; // импортируем функции настройки адресов и тип конфигурации из пакета разработки роутера

export default [ // открываем и экспортируем массив, в котором по очереди перечислим все страницы нашего сайта
    index("routes/home.tsx"),
    route("menu", "routes/menu.tsx"),
    route("cart", "routes/cart.tsx"),
    route("checkout", "routes/checkout.tsx"),
    route("about", "routes/about.tsx"),
    route("auth", "routes/auth.tsx"),
    route("orders", "routes/orders.tsx")

] satisfies RouteConfig;

