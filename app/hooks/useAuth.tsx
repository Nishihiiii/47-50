import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth"; // импорт функций отслеживания состояния сессии и выхода
import { auth } from "../../firebase.config";
import type { UserProfile } from "~/types";

interface AuthContextValue { // описание структуры данных, предоставляемых контекстом
    user: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null); // создание объекта контекста с начальным значением null

export function AuthProvider({ children }: { children: ReactNode }) { // компонент-провайдер для оборачивания приложения
    const [user, setUser] = useState<UserProfile | null>(null); // состояние для хранения профиля текущего пользователя
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // подписка на изменения состояния авторизации firebase (вход/выход)
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) { // если пользователь успешно авторизован в системе
                setUser({ // формирование локального профиля на основе данных из firebase
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    // генерация имени из почты, если у пользователя не заполнено displayName в firebase
                    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Пользователь",
                });
            } else {
                setUser(null); // сброс профиля при отсутствии авторизации
            }
            setLoading(false);
        });

        return () => unsubscribe(); // отписка от отслеживания при размонтировании компонента для предотвращения утечек памяти
    }, []);

    const logout = async () => { // функция для завершения сессии пользователя
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}> {/* передача данных авторизации всем дочерним компонентам */}
            {!loading && children} {/* рендеринг контента приложения только после завершения первичной проверки сессии */}
        </AuthContext.Provider>
    );
}

export function useAuth() { // кастомный хук для быстрого доступа к данным авторизации в компонентах
    const context = useContext(AuthContext);
    if (!context) { // проверка, что хук вызван внутри компонента, обёрнутого в AuthProvider
        throw new Error("useAuth must be used within an AuthProvider"); // выброс ошибки при некорректном использовании хука
    }
    return context;
}
