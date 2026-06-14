import axios from "axios"; // импорт библиотеки для выполнения http-запросов
import { API_URL } from "~/config"; // импорт базового адреса сервера из конфигурации

export const apiClient = axios.create({ // создание кастомного экземпляра axios с преднастройками
    baseURL: API_URL, // установка базового адреса для всех будущих запросов
    headers: {
        "Content-Type": "application/json", // указание дефолтного формата данных для отправки
    },
});

apiClient.interceptors.response.use( // настройка перехватчика ответов от сервера
    (response) => response, // возврат успешного ответа без изменений
    (error) => { // глобальная обработка возникающих ошибок запросов
        console.error("API Error:", error.response?.data || error.message); // логирование деталей ошибки в консоль
        return Promise.reject(error); // проброс ошибки дальше для обработки в месте вызова
    }
);

export default apiClient; // экспорт настроенного клиента по умолчанию
