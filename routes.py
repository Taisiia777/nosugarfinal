import json
from pathlib import Path
import hashlib
import logging
import requests
import asyncio
from aiohttp import web
from aiohttp.web_fileresponse import FileResponse
from aiohttp.web_request import Request
from aiohttp.web_response import json_response, Response

from aiogram import Bot
from aiogram.utils.web_app import check_webapp_signature

from datetime import datetime, timedelta, timezone
import math

from db import Database

db = Database('database.db')

# Configure logging
logging.basicConfig(level=logging.INFO, filename='logs/bezumno-bot-main.log', filemode="a",
                        format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

async def open_main_handler(request: Request):
        return web.HTTPFound("https://nosugar.shop/")



def get_token():
    logger.info("Fetching token from iiko services")
    res = requests.post("https://api-ru.iiko.services/api/1/access_token", json={"apiLogin": "02e47447-846e-4552-aa6e-c2379830cb89"})
    logger.info(f"response {res}")
    if res and res.text:
        json_res = json.loads(res.text)
        if json_res["token"]:
            token = json_res["token"]
            logger.info(f"Token fetched successfully {token}")
            return token
    logger.error("Failed to fetch token")
    return ''


def update_or_create_dots():
    logger.info("Updating or creating dots in the database")
    db.update_or_create_dot(get_token())
    return True


async def get_templates(token):
    response = requests.get(
        "https://api.lo.cards/v1/template",
        headers={"Authorization": "Bearer " + token}
    )

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Failed to get templates")






TERMINAL_KEY = "1709549650538"
PASSWORD = "apxhu5gch8gxq38c"  # Замените на ваш пароль из личного кабинета
CRM_SALE_API_URL = "https://api.test.locawallet.com/v1/crm/sale"
CRM_SALE_API_TOKEN = "5Da5dCLiGeRozdoVeziJMGW2jjSb6aMs"  # Замените на ваш токен
saved_card_number = None

def generate_token(params, password):
    # Шаг 1: Создаем массив передаваемых данных в виде пар Ключ-Значение
    values = {k: str(v) for k, v in params.items()}
    
    # Шаг 2: Добавляем в массив пару {Password, Значение пароля}
    values["Password"] = password
    
    # Шаг 3: Сортируем массив по алфавиту по ключу
    sorted_keys = sorted(values.keys())
    
    # Шаг 4: Конкатенируем только значения пар в одну строку
    concatenated_values = ''.join(values[k] for k in sorted_keys)
    
    # Шаг 5: Применяем к строке хеш-функцию SHA-256
    token = hashlib.sha256(concatenated_values.encode('utf-8')).hexdigest()
    
    return token

# Функция инициализации оплаты
async def init_tinkoff_payment_handler(request):
    data = await request.json()
    amount = data['amount']
    order_id = data['orderId']
    user_id = data['userId']
    items = data['items']
    pickup_time = data['pickup_time']
    selected_point_name = data['selectedPointName']
    comment = data['comment']
    payment_method = data['payment_method']
    _auth = data['_auth']

    payment_data = {
        "TerminalKey": TERMINAL_KEY,
        "Amount": 100 * amount,  # Сумма в копейках
        "OrderId": order_id,
        "Description": "Оплата заказа",
        "PaymentMethod": "SBP",  # Метод оплаты через СБП
        "DATA": {
            "Email": "user@example.com",
            "Phone": "+71234567890",

        }
    }




        


    response = requests.post("https://securepay.tinkoff.ru/v2/Init", json=payment_data)
    if response.status_code == 200:
        payment_info = response.json()
        payment_id = payment_info.get('PaymentId')
        payment_url = payment_info.get('PaymentURL')
        asyncio.create_task(check_tinkoff_payment_status_handler(request, payment_id, order_id, user_id, items, amount, pickup_time, selected_point_name, comment, payment_method, _auth))
        return json_response({"ok": True, "paymentUrl": payment_url, "orderId": order_id})
    else:
        return json_response({"ok": False, "err": "Не удалось инициализировать оплату"}, status=500)

# Функция для проверки статуса оплаты
async def check_tinkoff_payment_status_handler(request, payment_id, order_id, user_id, items, amount, pickup_time, selected_point_name, comment, payment_method, _auth):
    for attempt in range(15):  # Пробовать 15 раз (15 минут)
        await asyncio.sleep(60)  # Ждать 1 минуту перед каждой проверкой
        payment_status = await check_tinkoff_payment_status(payment_id)
        logger.info(f"Статус оплаты: {payment_status}")
        if payment_status == 'CONFIRMED':
            await create_order(request, order_id, user_id, items, amount, pickup_time, selected_point_name, comment, payment_method, _auth)
            logger.info(f"Заказ {order_id} успешно создан после подтверждения оплаты.")
            break
        else:
            logger.info(f"Попытка {attempt + 1}: Оплата не подтверждена для заказа {order_id}. Повторная попытка...")

# Функция для проверки статуса оплаты через API Тинькофф
async def check_tinkoff_payment_status(payment_id):
    params = {
        "TerminalKey": TERMINAL_KEY,
        "PaymentId": payment_id
    }
    token = generate_token(params, PASSWORD)
    params["Token"] = token

    response = requests.post("https://securepay.tinkoff.ru/v2/GetState", json=params)
    logger.info(f"Ответ сервера при проверке статуса оплаты: {response.json()}")
    if response.status_code == 200:
        payment_status = response.json().get('Status')
        if payment_status == 'CONFIRMED':
            return 'CONFIRMED'
        else:
            return 'FAILED'
    else:
        return 'ERROR'

# async def create_order(request, order_id, user_id, items, amount, pickup_time, selected_point_name, comment, payment_method, _auth):
#     bot: Bot = request.app["bot"]

#     user = db.get_or_create_user(user_id)

#     if check_webapp_signature(bot.token, _auth) and user:
#         basket_json = json.loads(items)
#         description = ''
#         sum = amount

#         for el in basket_json:
#             description += el['name'] + " " + el["size"]
#             for add in el["additional"]:
#                 description += " + " + add["name"]
#             description += ", "

#         description = description[:-2]

#         points = 0
#         pickup_time = pickup_time
#         payment_method = payment_method
#         oder_id = db.create_order(user[0], sum, points, selected_point_name, items, False, pickup_time, payment_method)

#         # Начисление и списание бонусов и скидок
#         await apply_bonuses_and_discounts(user_id, basket_json, oder_id, sum)

#         if payment_method == 'online':
#             await create_order_on_dot(order_id=oder_id, pickup_time=pickup_time, comment=comment, basket=items)
#         chat_message = (
#             f"Вы оформили заказ по адресу {selected_point_name} "
#             f"с номером {oder_id} на {pickup_time}."
#         )

#         try:
#             await bot.send_message(chat_id=user[1], text=chat_message)
#             logger.info(f"Order created successfully with ID: {oder_id}. Message sent to user.")
#         except Exception as e:
#             logger.error(f"Failed to send message to user: {e}")

#         logger.info(f"Order created successfully with ID: {oder_id} {items}")
#     else:
#         logger.error("Unauthorized access attempt or user not found")
# Пример: Оформление заказа с проверкой и распаковкой "additional"
async def create_order(request, order_id, user_id, items, amount, pickup_time, selected_point_name, comment, payment_method, _auth):
    bot: Bot = request.app["bot"]

    user = db.get_or_create_user(user_id)

    if check_webapp_signature(bot.token, _auth) and user:
        basket_json = json.loads(items)
        description = ''
        sum = amount

        for el in basket_json:
            description += el['name'] + " " + el["size"]

            # Логирование содержимого "additional" для каждого элемента
            logger.info(f"Processing 'additional' for item {el['name']}: {el.get('additional')}")

            additional = el.get('additional', [])

            # Проверяем, что "additional" это список
            if isinstance(additional, list):
                # Если это список списков, разворачиваем его
                if additional and isinstance(additional[0], list):
                    additional = [item for sublist in additional for item in sublist]
                    logger.info(f"Flattened 'additional': {additional}")

                # Проходим по каждому элементу "additional"
                for add in additional:
                    logger.info(f"Processing 'add': {add}")
                    
                    if isinstance(add, dict) and "name" in add:
                        description += " + " + add["name"]
                    else:
                        logger.error(f"Invalid 'add' format, expected a dictionary with 'name': {add}")
            else:
                logger.error(f"'additional' is not a list for item {el['name']}: {el.get('additional')}")
            
            description += ", "

        description = description[:-2]

        points = 0
        pickup_time = pickup_time
        payment_method = payment_method
        oder_id = db.create_order(user[0], sum, points, selected_point_name, items, False, pickup_time, payment_method)

        # Начисление и списание бонусов и скидок
        await apply_bonuses_and_discounts(user_id, basket_json, oder_id, sum)

        if payment_method == 'CASH':
            await create_order_on_dot(order_id=oder_id, pickup_time=pickup_time, comment=comment, basket=items)

        # Формирование и отправка сообщения пользователю
        chat_message = (
            f"Вы оформили заказ по адресу {selected_point_name} "
            f"с номером {oder_id} на {pickup_time}."
        )

        try:
            await bot.send_message(chat_id=user[1], text=chat_message)
            logger.info(f"Order created successfully with ID: {oder_id}. Message sent to user.")
        except Exception as e:
            logger.error(f"Failed to send message to user: {e}")

        logger.info(f"Order created successfully with ID: {oder_id} {items}")
    else:
        logger.error("Unauthorized access attempt or user not found")

async def apply_bonuses_and_discounts(user_id, basket_json, order_id, sum):
    products = []
    total_amount = 0

    logger.info(f"Order data: {basket_json}")
    for item in basket_json:
        quantity = item.get("amount", 1)
        price = item.get("price", 0)
        total_amount += price * quantity  # Подсчёт общей стоимости
        products.append({
            "name": item["name"],
            "id": item["id"],
            "count": quantity,
            "price": price,
            "summ": price * quantity,
            "setting": {
                "productId": item["id"],
                "cashback": 0,
                "writeoffPercentage": 100,
                "discount": 0,
                "stopList": False
            }
        })
    
    bonuses_write_off = total_amount - sum

   # Используем сохранённый номер карты
    global saved_card_number


    url = 'https://api.lo.cards/v1/crm/sale'
    headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer 5Da5dCLiGeRozdoVeziJMGW2jjSb6aMs',
        'Content-Type': 'application/json'
    }
    data = {
        "amount": total_amount,  # Используем подсчитанную стоимость корзины
        "bonusesWriteOff": bonuses_write_off,  # Замените на нужное значение
        "otherDiscountsAmount": 0,  # Замените на нужное значение
        "cardNumber": saved_card_number,  # Используем сохранённый номер карты
        "discount": 0  # Замените на нужное значение
    }

    response = requests.post(url, json=data, headers=headers)

    
async def create_card_handler(request):
    logger.info("create_card")
    data = await request.json()

    token = "5Da5dCLiGeRozdoVeziJMGW2jjSb6aMs"
    
    try:
        templates = await get_templates(token)
        template_id = templates[0]['id']  # предположим, что используем первый шаблон из списка
    except Exception as e:
        logger.error(f"Error getting templates: {e}")
        return json_response({"ok": False, "err": "Failed to get templates"}, status=500)

    card_data = {
        "firstName": data.get("firstName"),
        "middleName": data.get("middleName"),
        "lastName": data.get("lastName"),
        "gender": data.get("gender"),
        "phone": data.get("phone"),
        "birthday": data.get("birthday"),
        "code": data.get("code"),
        "referrerId": data.get("referrerId", 0)
    }

    response = requests.post(
        f"https://api.lo.cards/v1/card/issue?templateId={template_id}",
        json=card_data,
        headers={"Authorization": "Bearer " + token}
    )

    logger.info(f"Create card response status code: {response.status_code}")
    logger.info(f"Create card response text: {response.text}")

    if response.status_code == 201:
        return json_response(response.json())
    else:
        return json_response({"ok": False, "err": "Failed to create card"}, status=500)

async def login_card_handler(request: Request):
    logger.info("login_card")
    data = await request.json()

    token = "5Da5dCLiGeRozdoVeziJMGW2jjSb6aMs"
    phone_number = data.get("phone", "").replace("+", "")  # Извлечение номера телефона и удаление +

    # Получение списка карт
    response = requests.get(
        "https://api.lo.cards/v1/crm/card",
        headers={"Authorization": "Bearer " + token}
    )


    if response.status_code == 200:
        cards = response.json().get("data", [])
        # Проверка наличия карты с совпадающим номером телефона
        for card in cards:
            if card.get("phone") == phone_number:  # Поиск карты по номеру телефона
                global saved_card_number
                saved_card_number = card.get("cardNumber")  # Сохранение номера карты
                return json_response({"ok": True, "data": card})
        return json_response({"ok": False, "err": "Card not found"}, status=404)
    else:
        return json_response({"ok": False, "err": "Failed to login card"}, status=500)

async def get_dots_handler(request: Request):
    logger.info("Handling get_dots request")
    bot: Bot = request.app["bot"]

    data = await request.json()
    if check_webapp_signature(bot.token, data["_auth"]):
        dots_data = []
        for line in db.get_dots():
            dots_data.append({
                'id': line[2],
                'name': line[3].replace('Безумно. ', ''),
                'pickup_start': line[5],
                'pickup_end': line[6],
            })
        logger.info("Dots data retrieved successfully")
        return json_response({"ok": True, "dots": dots_data})
    logger.warning("Unauthorized access attempt")
    return json_response({"ok": False, "err": "Unauthorized"}, status=401)

async def get_orders_by_user_handler(request: Request):
    logger.info("Handling get_orders_by_user request")
    bot = request.app["bot"]

    data = await request.json()
    user = db.get_or_create_user(data['userId'])

    if check_webapp_signature(bot.token, data["_auth"]):
        orders_data = []
        for line in db.get_orders_by_user(user[0]):
            orders_data.append({
                'id': line[0],
                'user_id': line[1],
                'summ': line[2],
                'points': line[3],
                'dot': line[4],
                'order_content': line[5],
                'paid': line[6],
                'pickup_time': line[7],
                'payment_method': line[8],
            })
            
        logger.info(f"Orders data retrieved successfully for user_id: {user[0]}")
        return json_response({"ok": True, "orders": orders_data})

    logger.warning("Unauthorized access attempt")
    return json_response({"ok": False, "err": "Unauthorized"}, status=401)

async def pay_success(request: Request):
    logger.info("Handling pay_success request")
    data = await request.post()
    if data["orderid"] and data["id"]:
        await create_order_on_dot(order_id=data["orderid"])
        logger.info("Order created successfully on dot")
        return Response(status=200,
                        text="OK " + hashlib.md5((data["id"] + "(4I=L_=)4_{VnT(uV)6_").encode()).hexdigest())
    logger.error("Invalid data in pay_success request")
    return Response(status=400, text="Bad Request")


async def get_pickup_time(dot):
    logger.info("Calculating pickup time")
    time_data = []
    now = datetime.utcnow() + timedelta(hours=7)# На томское время
    hours, minutes = divmod(math.ceil(now.minute / 10) * 10, 60)
    rounded_time = (now + timedelta(hours=hours)).replace(minute=minutes).replace(second=0).replace(
        microsecond=0) + timedelta(minutes=10)
    current_date = datetime.strftime(rounded_time, '%d-%m-%Y %H:%M').split(' ')[0]
    if dot[5] and dot[6]:
        pickup_start = datetime.strptime(current_date + ' ' + dot[5], '%d-%m-%Y %H:%M')
        pickup_end = datetime.strptime(current_date + ' ' + dot[6], '%d-%m-%Y %H:%M')
        if rounded_time < pickup_start:
            time_pickup = pickup_start
        else:
            time_pickup = rounded_time
        while time_pickup <= pickup_end:
            time_data.append(datetime.strftime(time_pickup, '%d-%m-%Y %H:%M').split(' ')[1])
            time_pickup = time_pickup + timedelta(minutes=10)
    else:
        time_pickup = rounded_time
        for i in range(72):
            time_data.append(datetime.strftime(time_pickup, '%d-%m-%Y %H:%M').split(' ')[1])
            time_pickup = time_pickup + timedelta(minutes=10)

    logger.info("Pickup time calculated successfully")
    return time_data

async def get_user_phone_number(request: Request):
    logger.info("Fetching user phone number")
    # data = await request.post()
    data = await request.json()

    user = db.get_or_create_user(data['userId'])
    logger.info(f"Received data: {user}")
    if user:
        phone_number = user[2]

        if phone_number.startswith('7') or phone_number.startswith('8'):
            phone_number = '+7' + phone_number[1:]

        logger.info("User phone number retrieved successfully")
        return json_response({"ok": True, "phone_number": phone_number})
    else:
        logger.error("User not found")
        return json_response({"ok": False, "err": "User not found"}, status=401)

async def get_user_phone_info_handler(request: Request):
    logger.info("Fetching user phone info")
    bot: Bot = request.app["bot"]

    data = await request.post()
    user = db.get_or_create_user(data['userId'])

    if user:
        phone = user[2]

        if phone.startswith('7') or phone.startswith('8'):
            phone = '+7' + phone[1:]

        token = get_token()
        response = requests.post(
            "https://api-ru.iiko.services/api/1/loyalty/iiko/customer/info",
            json={
                "phone": phone,
                "type": "phone",
                "organizationId": "b5330ce0-36ae-4fd5-8b3b-a51c304005ea"
            },
            headers={"Authorization": "Bearer " + token}
        )

        res = response.json()
        logger.info("User phone info retrieved successfully")
        return json_response({"ok": True, "data": res})

    logger.error("User not found")
    return json_response({"ok": False, "err": "User not found"}, status=401)  


async def get_points_handler(request: Request):
    logger.info("Handling get_points request")
    bot: Bot = request.app["bot"]

    data = await request.post()
    user = db.get_or_create_user(data['userId'])

    if check_webapp_signature(bot.token, data["_auth"]) and data['userId']:
        if user:

            basket_json = json.loads(data["basket"])

            time_data = await get_pickup_time(db.get_dot(data["selectedPoint"]))

            items = ''
            sum = 0
            for el in basket_json:
                sum += el["price"]
                modifiers = ''
                for add in el["additional"]:
                    modifiers += '{"productId": "' + add["elId"] + '","amount": 1},'
                modifiers = modifiers[:-1]
                items += '{"type": "Product","productId": "' + el["sizeId"] + '","amount": 1,"price": ' + str(
                    el["price"]) + ',"modifiers": [ ' + modifiers + ']},'
            items = items[:-1]
            items = '[' + items + ']'

            phone = user[2]

            if phone.startswith('7') or phone.startswith('8'):
                phone = '+7' + phone[1:]

            token = get_token()
            points = 0
            if token:
                response = requests.post("https://api-ru.iiko.services/api/1/loyalty/iiko/calculate",
                                         json={
                                             "organizationId": "b5330ce0-36ae-4fd5-8b3b-a51c304005ea",
                                             "order": {
                                                 "items": json.loads(items),
                                                 "orderTypeId": "5b1508f9-fe5b-d6af-cb8d-043af587d5c2",
                                                 "phone": phone
                                             }
                                         },
                                         headers={"Authorization": "Bearer " + token})

                if response.text:
                    res = json.loads(response.text)
                    if res and res["availablePayments"] and len(res["availablePayments"]) > 0:
                        points = res["availablePayments"][0]["maxSum"]
                        if points >= sum:
                            points = sum - 1

            logger.info("Points data retrieved successfully")
            return json_response({"ok": True, "points": points, "time_data": time_data})
        logger.error("User not found")
        return json_response({"ok": False, "err": "User not found"}, status=401)
    logger.warning("Unauthorized access attempt")
    return json_response({"ok": False, "err": "Unauthorized"}, status=401)


async def get_menu_handler(request: Request):
    logger.info("get_menu")
    bot: Bot = request.app["bot"]

    data = await request.json()

    if check_webapp_signature(bot.token, data["_auth"]):
        logger.info("get_menu if case")
        token = get_token()
        logger.info(f"Token: {token}")

        if token:
            res_menu = requests.post(
                "https://api-ru.iiko.services/api/2/menu/by_id",
                json={
                "externalMenuId": "28222",
                "organizationIds": [
                "b5330ce0-36ae-4fd5-8b3b-a51c304005ea"
                ],
                "priceCategoryId": "00000000-0000-0000-0000-000000000000"
                },
                headers={"Authorization": "Bearer " + token}
            )
            logger.info(f"Menu response status code: {res_menu.status_code}")

            if res_menu.status_code == 200:
                return json_response(res_menu.json())
            else:
                return json_response({"ok": False, "err": "Failed to fetch menu from API"}, status=500)

    logger.warning("Unauthorized access attempt")
    return json_response({"ok": False, "err": "Unauthorized"}, status=401)




async def create_order_handler(request: Request):
        logger.info("Handling create_order request")
        bot: Bot = request.app["bot"]

        data = await request.json()
        logger.info(f'create_order_handler1 {data}')
        user = db.get_or_create_user(data['userId'])
        pickup_time = data['pickup_time']

        if check_webapp_signature(bot.token, data["_auth"]) and data['userId']:
            if user:
                basket_json = json.loads(data["basket"])
                items = ''
                description = ''
                sum = 0
                for el in basket_json:
                    sum += el["price"]
                    description += el['name'] + " " + el["size"]
                    modifiers = ''
                    modifierDescr = ''
                    for add in el["additional"]:
                        modifiers += '{"productId": "' + add["elId"] + '","amount": 1},'
                        description += " + " + add["name"]
                        modifierDescr += add["name"]
                    modifiers = modifiers[:-1]
                    description += ", "
                    # items += '{"type": "Product","productId": "' + el["sizeId"] + '","amount": 1,"price": ' + str(
                    #     el["price"]) + ',"name": "' + el["name"] + '","size": "' + el["size"] + '","modifiers": [' + modifiers + ']},'
                    item = {
                        "type": "Product",
                        "productId": el["sizeId"],
                        "amount": 1,
                        "price": el["price"],
                        "name": el["name"],
                    }
                    items += json.dumps(item) + ','
                items = items[:-1]  # Removing the trailing comma
                items = '[' + items + ']'
                logger.info(f"{str(json.loads(f'[{modifiers}]') if modifiers else [])}")

                description = description[:-2]

                points = 0
                if data['points'] and data['points'] != '0':
                    p = int(data['points'])
                    if p and p > 0:
                        points = p
                        sum -= p

                pickup_time = data['pickup_time']
                payment_method = data['payment_method']
                oder_id = db.create_order(user[0], sum, points, data['selectedPointName'], items, False, pickup_time,
                                        payment_method)
                if payment_method == 'CASH':
                    await create_order_on_dot(order_id=oder_id, pickup_time=pickup_time, comment=data['comment'], basket=data['basket'])
                chat_message = (
                    f"Вы оформили заказ по адресу {data['selectedPointName']} "
                    f"с номером {oder_id} на {pickup_time}."
                )

                # Отправка сообщения в чат
                try:
                    await bot.send_message(chat_id=user[1], text=chat_message)
                    logger.info(f"Order created successfully with ID: {oder_id}. Message sent to user.")
                except Exception as e:
                    logger.error(f"Failed to send message to user: {e}")

                return json_response(
                    {"ok": True, "phone": user[2], "orderid": oder_id, "description": description, "sum": sum})
                logger.info(f"Order created successfully with ID: {oder_id} {items}")
                return json_response(
                    {"ok": True, "phone": user[2], "orderid": oder_id, "description": description, "sum": sum})
            logger.error("User not found")
            return json_response({"ok": False, "err": "User not found"}, status=401)
        logger.warning("Unauthorized access attempt")
        return json_response({"ok": False, "err": "Unauthorized"}, status=401)


def get_terminal_group_id(organization_id, token):
    logger.info("Fetching terminal group ID")
    if token:
        response = requests.post("https://api-ru.iiko.services/api/1/terminal_groups",
                                 json={
                                     "organizationIds": "b5330ce0-36ae-4fd5-8b3b-a51c304005ea",
                                     "includeDisabled": True,
                                     "returnExternalData": [
                                         "string"
                                     ]
                                 },
                                 headers={"Authorization": "Bearer " + token})
        json_data = json.loads(response.text)
        logger.info("Terminal group ID fetched successfully")
        return json_data['terminalGroups'][0]['items'][0]['id']
    logger.error("Failed to fetch terminal group ID")
    return None





# async def create_order_on_dot(order_id, pickup_time, comment, basket):
#     logger.info(f"Creating order on dot for order ID: {order_id}")
#     order_id = int(order_id)
#     tomsk_offset = timedelta(hours=3)
#     tomsk_timezone = timezone(tomsk_offset)
#     current_date = datetime.now(tomsk_timezone)
#     pickup_time_parsed = datetime.strptime(pickup_time, "%H:%M")
#     combined_datetime = current_date.replace(hour=pickup_time_parsed.hour, minute=pickup_time_parsed.minute, second=0, microsecond=0)
#     formatted_time = combined_datetime.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]

#     if isinstance(order_id, int) and order_id > 0:
#         order = db.get_order(order_id)
#         user = db.get_user_by_id(int(order[1]))
        
#         if user:
#             phone = user[2]
#             if phone.startswith('7') or phone.startswith('8'):
#                 phone = '+7' + phone[1:]
            
#             token = get_token()
#             terminal_group_id = "fba63bf1-83f3-83ab-018c-6273dbda0064"
#             if order[8] == 'online':
#                 payments = [
#                     {
#                         "paymentTypeKind": "Card",
#                         "sum": "1",
#                         "isProcessedExternally": "false",
#                         "paymentTypeId": "990a0222-a297-4619-b300-a8e70f693c77",
#                         "paymentAdditionalData": {
#                             "type": "Card",
#                             "credential": phone,
#                             "searchScope": "Phone"
#                         }
#                     }
#                 ]
#             else:
#                 payments = [
#                     {
#                         "paymentTypeKind": "CASH",
#                         "sum": "1",
#                         "isProcessedExternally": "false",
#                         "paymentTypeId": "09322f46-578a-d210-add7-eec222a08871",
#                         "paymentAdditionalData": {
#                             "type": "При получении",
#                             "credential": phone,
#                             "searchScope": "Phone"
#                         }
#                     }
#                 ]

#             if token:
#                 basket_items = json.loads(order[5])
#                 formatted_items = [
#                     {
#                         "productId": item["id"],
#                         "price": item["price"],
#                         "amount": item.get("amount", 1),
#                         "type": "Product"
#                     }
#                     for item in basket_items
#                 ]

#                 request_body = {
#                     "organizationId": "b5330ce0-36ae-4fd5-8b3b-a51c304005ea",
#                     "terminalGroupId": terminal_group_id,
#                     "priceCategories": {
#                         "name": "1"
#                     },
#                     "order": {
#                         "externalNumber": str(order_id),
#                         "items": formatted_items,
#                         "completeBefore": str(formatted_time),
#                         "payments": payments,
#                         "orderTypeId": "570ae9c0-94db-4383-b31f-cc85e44ba78b",
#                         "phone": phone,
#                         "comment": f"не готовить!  тест чат бота, заказ №{order_id}"
#                     }
#                 }

#                 # Логирование всего тела запроса
#                 logger.info(f"Request body: {json.dumps(request_body, indent=2, ensure_ascii=False)}")

#                 response = requests.post(
#                     "https://api-ru.iiko.services/api/1/deliveries/create?Timeout=50",
#                     json=request_body,
#                     headers={"Authorization": "Bearer " + token}
#                 )

#                 if response.status_code == 200:
#                     response_data = response.json()
#                     external_number = response_data.get('orderInfo', {}).get('externalNumber')
#                     logger.info(f"Order with ID: {order_id} created on dot successfully with externalNumber: {external_number}")
#                     return external_number
#                 else:
#                     logger.error(f"Failed to create order: {response.status_code} - {response.text}")
#                     return None
#         else:
#             logger.error(f"User not found for order ID: {order_id}")
#             return None
#     else:
#         logger.error(f"Invalid order ID: {order_id}")
#         return None

async def create_order_on_dot(order_id, pickup_time, comment, basket):
    logger.info(f"Creating order on dot for order ID: {order_id}")
    
    try:
        order_id = int(order_id)
        tomsk_offset = timedelta(hours=3)
        tomsk_timezone = timezone(tomsk_offset)
        current_date = datetime.now(tomsk_timezone)
        pickup_time_parsed = datetime.strptime(pickup_time, "%H:%M")
        combined_datetime = current_date.replace(hour=pickup_time_parsed.hour, minute=pickup_time_parsed.minute, second=0, microsecond=0)
        formatted_time = combined_datetime.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]

        logger.info(f"Order ID: {order_id}, Pickup Time: {formatted_time}")

        if isinstance(order_id, int) and order_id > 0:
            order = db.get_order(order_id)
            logger.info(f"Fetched order data: {order}")
            
            user = db.get_user_by_id(int(order[1]))
            if not user:
                logger.error(f"User not found for order ID: {order_id}")
                return None

            logger.info(f"User data: {user}")

            phone = user[2]
            if phone.startswith('7') or phone.startswith('8'):
                phone = '+7' + phone[1:]

            logger.info(f"User phone: {phone}")

            token = get_token()
            logger.info(f"Fetched token: {token}")
            
            terminal_group_id = "fba63bf1-83f3-83ab-018c-6273dbda0064"

            if order[8] == 'online':
                payments = [
                    {
                        "paymentTypeKind": "Card",
                        "sum": "1",
                        "isProcessedExternally": "false",
                        "paymentTypeId": "990a0222-a297-4619-b300-a8e70f693c77",
                        "paymentAdditionalData": {
                            "type": "Card",
                            "credential": phone,
                            "searchScope": "Phone"
                        }
                    }
                ]
            else:
                payments = [
                    {
                        "paymentTypeKind": "CASH",
                        "sum": "1",
                        "isProcessedExternally": "false",
                        "paymentTypeId": "09322f46-578a-d210-add7-eec222a08871",
                        "paymentAdditionalData": {
                            "type": "При получении",
                            "credential": phone,
                            "searchScope": "Phone"
                        }
                    }
                ]

            logger.info(f"Payments data: {payments}")

            if token:
                basket_items = json.loads(order[5])
                logger.info(f"Original basket items: {basket_items}")

                # Ensure basket is a list of dictionaries
                if isinstance(basket, str):
                    basket = json.loads(basket)
                logger.info(f"Converted basket: {basket}")

                # Convert basket to a dictionary for faster lookup
                basket_dict = {item['sizeId']: item for item in basket}
                logger.info(f"Basket dictionary for lookup: {basket_dict}")

                formatted_items = []
                for item in basket_items:
                    item_data = {
                        "productId": item["id"],
                        "price": item["price"],
                        "amount": item.get("amount", 1),
                        "type": "Product"
                    }

                    # Добавляем допы/модификаторы, если они есть
                    if 'modifiers' in item:
                        item_data['modifiers'] = [
                            {
                                "productId": mod["id"],
                                "amount": mod.get("amount", 1),
                                "price": mod.get("price", 0)
                            }
                            for mod in item['modifiers']
                        ]

                    # Если у товара есть aditionals, добавляем их
                    if 'aditionals' in item:
                        item_data['aditionals'] = [
                            {
                                "productId": ad["id"],
                                "amount": ad.get("amount", 1),
                                "price": ad.get("price", 0)
                            }
                            for ad in item['aditionals']
                        ]
                    
                    formatted_items.append(item_data)

                logger.info(f"Formatted basket items: {formatted_items}")

                request_body = {
                    "organizationId": "b5330ce0-36ae-4fd5-8b3b-a51c304005ea",
                    "terminalGroupId": terminal_group_id,
                    "priceCategories": {
                        "name": "1"
                    },
                    "order": {
                        "externalNumber": str(order_id),
                        "items": formatted_items,
                        "completeBefore": str(formatted_time),
                        "payments": payments,
                        "orderTypeId": "570ae9c0-94db-4383-b31f-cc85e44ba78b",
                        "phone": phone,
                        "comment": f"не готовить!  тест чат бота, заказ №{order_id}"
                    }
                }

                # Логирование всего тела запроса
                logger.info(f"Request body: {json.dumps(request_body, indent=2, ensure_ascii=False)}")

                response = requests.post(
                    "https://api-ru.iiko.services/api/1/deliveries/create?Timeout=50",
                    json=request_body,
                    headers={"Authorization": "Bearer " + token}
                )

                logger.info(f"Response status code: {response.status_code}")
                logger.info(f"Response content: {response.text}")

                if response.status_code == 200:
                    response_data = response.json()
                    external_number = response_data.get('orderInfo', {}).get('externalNumber')
                    logger.info(f"Order with ID: {order_id} created on dot successfully with externalNumber: {external_number}")
                    return external_number
                else:
                    logger.error(f"Failed to create order: {response.status_code} - {response.text}")
                    return None
            else:
                logger.error(f"Token retrieval failed")
        else:
            logger.error(f"Invalid order ID: {order_id}")
            return None
    except Exception as e:
        logger.error(f"Error in create_order_on_dot: {str(e)}", exc_info=True)
        return None



async def check_is_auth_handler(request: Request):
    logger.info("Handling check_is_auth request")
    bot: Bot = request.app["bot"]

    try:
        data = await request.json()
        user = db.get_or_create_user(data['userId'])
        if check_webapp_signature(bot.token, data["_auth"]) and data['userId']:
            return json_response({"ok": True, "isAuth": user[3] == 1})
        logger.warning("Unauthorized access attempt")
        return json_response({"ok": False, "err": "Unauthorized", "isAuth": False}, status=401)
    except KeyError as e:
        logger.error(f"KeyError: {str(e)}")
        return json_response({"ok": False, "err": f"Missing key: {str(e)}"}, status=400)
    except Exception as e:
        logger.error(f"Error handling request: {str(e)}")
        return json_response({"ok": False, "err": "Internal Server Error"}, status=500)
