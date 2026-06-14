from flask import Blueprint, jsonify, request # импорт инструментов для создания маршрутов и обработки запросов
from config.firebase import db # импорт объекта базы данных firebase
from data.menu_data import DEFAULT_MENU # импорт начальных данных для меню

menu_bp = Blueprint('menu', __name__) # создание изолированного модуля маршрутов меню

def seed_menu_if_empty(): # функция первичного заполнения базы данных
    if db is None: # проверка на наличие подключения к базе
        return # прерывание функции, если подключения нет
    
    try:
        menu_ref = db.collection("menu") # получение ссылки на коллекцию menu
        docs = menu_ref.limit(1).get() # запрос одной записи для проверки наличия данных
        if len(docs) == 0: # если коллекция оказалась пустой
            print("База данных пуста. Заполняю меню оригинальными блюдами...")
            for item in DEFAULT_MENU: # перебор элементов из дефолтного списка
                menu_ref.document(str(item["id"])).set(item) # сохранение блюда в базу с использованием его id
            print("Наполнение базы успешно завершено!")
    except Exception as e: # перехват любых ошибок при работе с базой
        print(f"Не удалось проверить или заполнить меню: {e}")

@menu_bp.route("/menu", methods=["GET"]) # регистрация get-эндпоинта для получения меню
def get_menu():
    if db is None:
        return jsonify({"error": "База данных недоступна"}), 500 # возврат ошибки сервера при отсутствии бд
    try:
        seed_menu_if_empty() # запуск проверки и заполнения базы перед выдачей
        menu_ref = db.collection("menu").stream() # получение потока всех документов из коллекции
        menu_list = [] # инициализация пустого списка для результата
        base_url = request.host_url # получение базового url текущего сервера
        
        for doc in menu_ref: # итерация по полученным из базы документам
            item = doc.to_dict() # преобразование данных документа в словарь python
            item["image"] = f"{base_url}assets/{item['image']}" # формирование полного url-пути к картинке
            menu_list.append(item) # добавление обработанного блюда в общий список
            
        menu_list.sort(key=lambda x: x.get("id", 0)) # сортировка элементов по возрастанию их id
        return jsonify(menu_list), 200 # отправка успешного ответа с данными в формате json
    except Exception as e:
        return jsonify({"error": str(e)}), 500 # возврат описания ошибки в формате json при сбое
