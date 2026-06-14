import { initializeApp } from "firebase/app"; //импорт функции для инициализации приложения firebase
import { getAuth } from "firebase/auth"; //импорт модуля для работы с аутентификацией

const firebaseConfig = { //объект с техническими ключами доступа к вашему проекту в firebase
    
    apiKey: "AIzaSyDXmriaTZOcmS9dNBFdQoWciupjwN2VMl8",
    authDomain: "restaurant-app-b2eb8.firebaseapp.com",
    projectId: "restaurant-app-b2eb8",
    storageBucket: "restaurant-app-b2eb8.firebasestorage.app",
    messagingSenderId: "446304619390",
    appId: "1:446304619390:web:3c4a4f8b885f303847c12f",
    measurementId: "G-6P2JX55LBF"
};

const app = initializeApp(firebaseConfig); //запуск и связь фронтенда с конкретным проектом firebase

export const auth = getAuth(app); //создание и экспорт объекта авторизации для дальнейшего использования в компонентах
