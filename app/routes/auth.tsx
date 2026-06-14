import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form"; // импорт библиотеки для удобного управления состояниями форм
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // импорт методов авторизации, регистрации и обновления профиля
import { auth } from "../../firebase.config";

interface AuthFormData { // описание структуры данных полей формы авторизации и регистрации
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export function meta() {
    return [{ title: "Авторизация | Yummy Cloud" }];
}

export default function AuthPage() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true); // состояние переключения между режимами входа и регистрации

    const [serverError, setServerError] = useState<string | null>(null); // состояние для ошибок ответа от сервера (firebase)
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<AuthFormData>(); // деструктуризация методов react-hook-form для работы с инпутами и валидацией

    const onSubmit = async (data: AuthFormData) => { // функция-обработчик отправки формы
        setServerError(null); // сброс старых серверных ошибок перед новой попыткой
        setIsLoading(false);

        if (!isLogin && data.password !== data.confirmPassword) { // проверка совпадения паролей в режиме регистрации
            setServerError("Пароли не совпадают"); // установка ошибки при несовпадении паролей
            return; // прерывание выполнения функции
        }

        setIsLoading(true);

        try {
            if (isLogin) { // если выбран режим входа
                await signInWithEmailAndPassword(auth, data.email, data.password); // аутентификация пользователя по почте и паролю
            } else { // если выбран режим регистрации нового аккаунта
                const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password); // создание нового аккаунта в firebase
                if (data.name) { // если при регистрации было заполнено поле имени
                    await updateProfile(userCredential.user, { displayName: data.name }); // обновление публичного имени пользователя в firebase
                }
            }
            navigate("/menu"); // перенаправление на страницу меню после успешного входа или регистрации
        } catch (err: any) { // блок обработки ошибок, возвращаемых сервером firebase
            switch (err.code) { // разбор системного кода ошибки для вывода понятного текста пользователю
                case "auth/email-already-in-use":
                    setServerError("Этот email уже зарегистрирован.");
                    break;
                case "auth/weak-password":
                    setServerError("Пароль слишком простой (минимум 6 символов).");
                    break;
                case "auth/invalid-credential":
                    setServerError("Неверная почта или пароль.");
                    break;
                default:
                    setServerError("Ошибка доступа. Попробуйте снова.");
            }
        }
                finally {
            setIsLoading(false); // отключение индикатора загрузки после завершения всех процессов
        }
    };

    const handleTabChange = (loginMode: boolean) => { // функция для безопасного переключения вкладок формы
        setIsLogin(loginMode); // смена режима работы (вход или регистрация)
        setServerError(null); // очистка старых ошибок сервера при переключении
        reset(); // полный сброс ранее введенных пользователем данных в полях
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="flex border-b border-stone-200 bg-stone-50">
                <button
                    type="button"
                    onClick={() => handleTabChange(true)} // активация вкладки «Вход»
                    className={`flex-1 py-4 text-center font-medium transition-colors ${isLogin
                        ? "bg-white text-tom-thumb-800 border-b-2 border-tom-thumb-800" // стили для активной вкладки
                        : "text-stone-500 hover:text-stone-800" // стили для неактивной вкладки
                    }`}
                >
                    Вход
                </button>
                <button
                    type="button"
                    onClick={() => handleTabChange(false)} // активация вкладки «Регистрация»
                    className={`flex-1 py-4 text-center font-medium transition-colors ${!isLogin
                        ? "bg-white text-tom-thumb-800 border-b-2 border-tom-thumb-800"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                >
                    Регистрация
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4"> {/* обёртка формы для обработки валидации react-hook-form */}
                <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">
                    {isLogin ? "Авторизация" : "Создание аккаунта"} {/* динамический заголовок в зависимости от режима */}
                </h2>

                {serverError && ( // условный рендеринг блока для отображения глобальных ошибок от сервера
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200 text-center font-medium">
                        {serverError}
                    </div>
                )}

                {!isLogin && ( // отображение поля имени только в режиме регистрации нового пользователя
                    <div>
                        <label className="block text-stone-700 text-sm font-medium mb-1">Имя</label>
                        <input
                            type="text"
                            placeholder="Константин"
                            className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-tom-thumb-600 focus:border-transparent transition-all"
                            // регистрация инпута с динамическим правилом обязательности (нужно только при регистрации)
                            {...register("name", { required: !isLogin })}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">Обязательное поле</p>} {/* вывод ошибки валидации */}
                    </div>
                )}
                {/* Оставшиеся инпуты для email, пароля и кнопка отправки обрезаны на изображении */}
            <div>
                <label className="block text-stone-700 text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    placeholder="example@mail.ru"
                    className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-tom-thumb-600 focus:border-transparent transition-all"
                    {...register("email", { required: "Введите email" })} // регистрация поля с кастомным текстом ошибки
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>} {/* вывод сообщения об ошибке email */}
            </div>

            <div>
                <label className="block text-stone-700 text-sm font-medium mb-1">Пароль</label>
                <input
                    type="password"
                    placeholder="********"
                    className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-tom-thumb-600 focus:border-transparent transition-all"
                    {...register("password", {
                        required: "Введите пароль",
                        minLength: { value: 6, message: "Минимум 6 символов" } // валидация минимальной длины пароля для требований firebase
                    })}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>} {/* вывод ошибки валидации пароля */}
            </div>

            {!isLogin && ( // отображение поля подтверждения пароля только при регистрации
                <div>
                    <label className="block text-stone-700 text-sm font-medium mb-1">Повторите пароль</label>
                    <input
                        type="password"
                        placeholder="********"
                        className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-tom-thumb-600 focus:border-transparent transition-all"
                        {...register("confirmPassword", { required: !isLogin })} // поле обязательно только в режиме регистрации
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">Обязательное поле</p>}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading} // блокировка кнопки во время активного запроса к firebase
                className="w-full bg-tom-thumb-800 text-white py-3 rounded-xl font-medium hover:bg-tom-thumb-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed mt-4 shadow-sm"
            >
                {isLoading ? "Загрузка..." : isLogin ? "Войти в личный кабинет" : "Зарегистрироваться"} {/* динамический текст кнопки */}
            </button>
        </form>
    </div>
);
}

