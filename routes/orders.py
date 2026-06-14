from flask import Blueprint, jsonify, request
from config.firebase import db
from firebase_admin import firestore # импорт модуля firestore для работы со специальными типами данных

orders_bp = Blueprint('orders', __name__) # создание изолированного модуля маршрутов для заказов

@orders_bp.route("/orders", methods=["POST"]) # регистрация post-эндпоинта для создания нового заказа
def create_order():
    if db is None:
        return jsonify({"error": "База данных недоступна"}), 500
        
    data = request.json # извлечение json-данных из тела запроса
    if not data or "customer" not in data or "items" not in data: # проверка наличия обязательных полей в заказе
        return jsonify({"error": "Неполные данные заказа."}), 400 # возврат ошибки клиента при неполных данных
        
    try:
        new_order = { # формирование словаря с данными нового заказа
            "customer": data["customer"],
            "items": data["items"],
            "total": data.get("total", 0), # получение суммы заказа (0 по умолчанию, если поля нет)
            "userId": data.get("userId"), # получение id пользователя (null по умолчанию)
            "status": "Новый", # установка начального статуса заказа
            "created_at": firestore.SERVER_TIMESTAMP # запись серверного времени создания
        }
        
        _, doc_ref = db.collection("orders").add(new_order) # добавление документа в коллекцию и получение ссылки на него
        print(f"Получен новый заказ! ID в Firebase: {doc_ref.id}")
        return jsonify({"success": True, "order_id": doc_ref.id}), 201 # возврат успешного статуса создания
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
@orders_bp.route("/orders", methods=["GET"]) # регистрация get-эндпоинта для получения списка заказов
def get_orders():
    if db is None:
        return jsonify({"error": "База данных недоступна"}), 500
        
    try:
        user_id = request.args.get("userId") # получение id пользователя из query-параметров строки url
        orders_ref = db.collection("orders")
        
        if user_id: # если в запросе передан id пользователя
            query = orders_ref.where(filter=firestore.FieldFilter("userId", "==", user_id)) # фильтрация заказов по конкретному пользователю
            docs = query.stream() # получение отфильтрованного потока документов
        else:
            docs = orders_ref.stream() # получение всех заказов, если id пользователя не передан
            
        orders_list = []
        for doc in docs:
            order_data = doc.to_dict()
            order_data["id"] = doc.id # сохранение id документа внутрь словаря с данными
            if "created_at" in order_data and order_data["created_at"]: # проверка наличия временной метки создания
                try:
                    order_data["created_at"] = order_data["created_at"].isoformat() # перевод объекта даты-времени в строку iso-формата
                except AttributeError: # обработка случая, если дата уже является строкой или имеет другой тип
                    order_data["created_at"] = str(order_data["created_at"]) # принудительное приведение к строке
            orders_list.append(order_data)
            
        return jsonify(orders_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
