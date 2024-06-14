# import json
# from pathlib import Path
# import hashlib

# import requests
# # from aiohttp import web
# from aiohttp.web_fileresponse import FileResponse
# from aiohttp.web_request import Request
# from aiohttp.web_response import json_response, Response

# from aiogram import Bot
# from aiogram.utils.web_app import check_webapp_signature

# from datetime import datetime, timedelta
# import math

# from db import Database

# db = Database('database.db')


# async def open_main_handler(request: Request):
#     return FileResponse(Path(__file__).parent.resolve() / "static/main.html")


# def get_token():
#     res = requests.post("https://api-ru.iiko.services/api/1/access_token", json={"apiLogin": "de902294-a56"})
#     if res and res.text:
#         json_res = json.loads(res.text)
#         if json_res["token"]:
#             token = json_res["token"]
#             return token

#     return ''


# def update_or_create_dots():
#     db.update_or_create_dot(get_token())
#     return True


# async def get_dots_handler(request: Request):
#     bot: Bot = request.app["bot"]

#     data = await request.post()
#     if check_webapp_signature(bot.token, data["_auth"]):
#         dots_data = []
#         for line in db.get_dots():
#             dots_data.append({
#                 'id': line[2],
#                 'name': line[3].replace('Безумно. ', ''),
#                 'pickup_start': line[5],
#                 'pickup_end': line[6],
#             })
#         return json_response({"ok": True, "dots": dots_data})
#     return json_response({"ok": False, "err": "Unauthorized"}, status=401)


# async def pay_success(request: Request):
#     data = await request.post()
#     if data["orderid"] and data["id"]:
#         await create_order_on_dot(order_id=data["orderid"])

#         return Response(status=200,
#                         text="OK " + hashlib.md5((data["id"] + "(4I=L_=)4_{VnT(uV)6_").encode()).hexdigest())


# async def get_pickup_time(dot):
#     time_data = []
#     now = datetime.utcnow() + timedelta(hours=7)# На томское время
#     hours, minutes = divmod(math.ceil(now.minute / 10) * 10, 60)
#     rounded_time = (now + timedelta(hours=hours)).replace(minute=minutes).replace(second=00).replace(
#         microsecond=0) + timedelta(minutes=10)
#     current_date = datetime.strftime(rounded_time, '%d-%m-%Y %H:%M').split(' ')[0]
#     if dot[5] and dot[6]:
#         pickup_start = datetime.strptime(current_date + ' ' + dot[5], '%d-%m-%Y %H:%M')
#         pickup_end = datetime.strptime(current_date + ' ' + dot[6], '%d-%m-%Y %H:%M')
#         if rounded_time < pickup_start:
#             time_pickup = pickup_start
#         else:
#             time_pickup = rounded_time
#         while time_pickup <= pickup_end:
#             time_data.append(datetime.strftime(time_pickup, '%d-%m-%Y %H:%M').split(' ')[1])
#             time_pickup = time_pickup + timedelta(minutes=10)
#     else:
#         time_pickup = rounded_time
#         for i in range(72):
#             time_data.append(datetime.strftime(time_pickup, '%d-%m-%Y %H:%M').split(' ')[1])
#             time_pickup = time_pickup + timedelta(minutes=10)

#     return time_data

# async def get_user_phone_number(request: Request):
#     data = await request.post()
#     user = db.get_or_create_user(data['userId'])
    
#     if user:
#         phone_number = user[2]

#         if phone_number.startswith('7') or phone_number.startswith('8'):
#             phone_number = '+7' + phone_number[1:]

#         return json_response({"ok": True, "phone_number": phone_number})
#     else:
#         return json_response({"ok": False, "err": "User not found"}, status=401)

# async def get_user_phone_info_handler(request: Request):
#     bot: Bot = request.app["bot"]

#     data = await request.post()
#     user = db.get_or_create_user(data['userId'])

#     if user:
#         phone = user[2]

#         if phone.startswith('7') or phone.startswith('8'):
#             phone = '+7' + phone[1:]

#         token = get_token()
#         response = requests.post(
#             "https://api-ru.iiko.services/api/1/loyalty/iiko/customer/info",
#             json={
#                 "phone": phone,
#                 "type": "phone",
#                 "organizationId": data["selectedPoint"]
#             },
#             headers={"Authorization": "Bearer " + token}
#         )

#         res = response.json()
#         return json_response({"ok": True, "data": res})

#     return json_response({"ok": False, "err": "User not found"}, status=401)  


# async def get_points_handler(request: Request):
#     bot: Bot = request.app["bot"]

#     data = await request.post()
#     user = db.get_or_create_user(data['userId'])

#     if check_webapp_signature(bot.token, data["_auth"]) and data['userId']:
#         if user:

#             basket_json = json.loads(data["basket"])

#             time_data = await get_pickup_time(db.get_dot(data["selectedPoint"]))

#             items = ''
#             sum = 0
#             for el in basket_json:
#                 sum += el["price"]
#                 modifiers = ''
#                 for add in el["additional"]:
#                     modifiers += '{"productId": "' + add["elId"] + '","amount": 1},'
#                 modifiers = modifiers[:-1]
#                 items += '{"type": "Product","productId": "' + el["sizeId"] + '","amount": 1,"price": ' + str(
#                     el["price"]) + ',"modifiers": [ ' + modifiers + ']},'
#             items = items[:-1]
#             items = '[' + items + ']'

#             phone = user[2]

#             if phone.startswith('7') or phone.startswith('8'):
#                 phone = '+7' + phone[1:]

#             token = get_token()
#             points = 0
#             if token:
#                 response = requests.post("https://api-ru.iiko.services/api/1/loyalty/iiko/calculate",
#                                          json={
#                                              "organizationId": data["selectedPoint"],
#                                              "order": {
#                                                  "items": json.loads(items),
#                                                  "orderTypeId": "5b1508f9-fe5b-d6af-cb8d-043af587d5c2",
#                                                  "phone": phone
#                                              }
#                                          },
#                                          headers={"Authorization": "Bearer " + token})

#                 if response.text:
#                     res = json.loads(response.text)
#                     if res and res["availablePayments"] and len(res["availablePayments"]) > 0:
#                         points = res["availablePayments"][0]["maxSum"]
#                         if points >= sum:
#                             points = sum - 1

#             return json_response({"ok": True, "points": points, "time_data": time_data})
#         return json_response({"ok": False, "err": "User not found"}, status=401)
#     return json_response({"ok": False, "err": "Unauthorized"}, status=401)


# async def get_menu_handler(request: Request):
#     bot: Bot = request.app["bot"]

#     data = await request.post()
#     if check_webapp_signature(bot.token, data["_auth"]):
#         if data:
#             if data["selectedPoint"]:
#                 token = get_token()
#                 if token:
#                     res_menu = requests.post("https://api-ru.iiko.services/api/1/nomenclature",
#                                              json={"organizationId": data["selectedPoint"]},
#                                              headers={"Authorization": "Bearer " + token})
#                     if res_menu and res_menu.text:
#                         json_res_menu = json.loads(res_menu.text)
#                         if json_res_menu["products"]:
#                             products = []
#                             for product in json_res_menu["products"]:
#                                 modifiers = []
#                                 modifiers_array = []
#                                 if product["type"] == "Dish":
#                                     for modifier in product["groupModifiers"]:
#                                         for product_for_modifier in json_res_menu["products"]:
#                                             if product_for_modifier["groupId"] == modifier["id"] and \
#                                                     product_for_modifier["id"] not in modifiers_array:
#                                                 modifiers.append({
#                                                     "id": product_for_modifier["id"],
#                                                     "name": product_for_modifier["name"],
#                                                     "price": product_for_modifier["sizePrices"][0]["price"][
#                                                         "currentPrice"]
#                                                 })
#                                                 modifiers_array.append(product_for_modifier["id"])

#                                     if 'L' not in product['name']: # Если это не шаурма(так как фотка стоит только от шавы)
#                                         continue

#                                     products.append({
#                                         "id": product["id"],
#                                         "name": product["name"],
#                                         "price": product["sizePrices"][0]["price"]["currentPrice"],
#                                         "modifiers": modifiers
#                                     })

#                             clear_products = []
#                             for product in products:
#                                 is_exits = False
#                                 for clear_product in clear_products:
#                                     size_data = []
#                                     if clear_product["name"] == product["name"].split(" ")[0]:
#                                         is_exits = True
#                                         clear_product["sizes"].append({
#                                             "name": product["name"].split(" ")[1],
#                                             "price": product["price"],
#                                             "id": product["id"],
#                                         })
#                                         size_data.append(product["name"].split(" ")[1])
#                                 if not is_exits:
#                                     clear_products.append({
#                                         "id": product["id"],
#                                         "name": product["name"].split(" ")[0],
#                                         "modifiers": product["modifiers"],
#                                         "sizes": [
#                                             {
#                                                 "id": product["id"],
#                                                 "name": product["name"].split(" ")[1],
#                                                 "price": product["price"],
#                                             }
#                                         ]
#                                     })

#                             return json_response({"ok": True, "products": clear_products})
#         return json_response({"ok": False})
#     return json_response({"ok": False, "err": "Unauthorized"}, status=401)


# async def create_order_handler(request: Request):
#     bot: Bot = request.app["bot"]

#     data = await request.post()
#     user = db.get_or_create_user(data['userId'])

#     if check_webapp_signature(bot.token, data["_auth"]) and data['userId']:
#         if user:
#             basket_json = json.loads(data["basket"])
#             items = ''
#             description = ''
#             sum = 0
#             for el in basket_json:
#                 sum += el["price"]
#                 description += el['name'] + " " + el["size"]
#                 modifiers = ''
#                 for add in el["additional"]:
#                     modifiers += '{"productId": "' + add["elId"] + '","amount": 1},'
#                     description += " + " + add["name"]
#                 modifiers = modifiers[:-1]
#                 description += ", "
#                 items += '{"type": "Product","productId": "' + el["sizeId"] + '","amount": 1,"price": ' + str(
#                     el["price"]) + ',"modifiers": [ ' + modifiers + ']},'
#             items = items[:-1]
#             items = '[' + items + ']'

#             description = description[:-2]

#             points = 0
#             if data['points'] and data['points'] != '0':
#                 p = int(data['points'])
#                 if p and p > 0:
#                     points = p
#                     sum -= p

#             pickup_time = data['pickup_time']
#             payment_method = data['payment_method']
#             oder_id = db.create_order(user[0], sum, points, data['selectedPoint'], items, False, pickup_time,
#                                       payment_method)

#             if payment_method == 'after':
#                 await create_order_on_dot(order_id=oder_id)

#             return json_response(
#                 {"ok": True, "phone": user[2], "orderid": oder_id, "description": description, "sum": sum})
#         return json_response({"ok": False, "err": "User not found"}, status=401)
#     return json_response({"ok": False, "err": "Unauthorized"}, status=401)


# def get_terminal_group_id(organization_id, token):
#     if token:
#         response = requests.post("https://api-ru.iiko.services/api/1/terminal_groups",
#                                  json={
#                                      "organizationIds": [organization_id],
#                                      "includeDisabled": True,
#                                      "returnExternalData": [
#                                          "string"
#                                      ]
#                                  },
#                                  headers={"Authorization": "Bearer " + token})
#         json_data = json.loads(response.text)
#         return json_data['terminalGroups'][0]['items'][0]['id']


# async def create_order_on_dot(order_id):
#     order_id = int(order_id)

#     if isinstance(order_id, int) and order_id > 0:
#         order = db.get_order(order_id)

#         user = db.get_user_by_id(int(order[1]))
#         if user:
#             phone = user[2]
#             if phone.startswith('7') or phone.startswith('8'):
#                 phone = '+7' + phone[1:]

#             token = get_token()
#             terminal_group_id = get_terminal_group_id(order[4], token)
#             if order[8] == 'online':
#                 payments = [
#                     {
#                         "paymentTypeKind": "IikoCard",
#                         "sum": "1",
#                         "isProcessedExternally": False,
#                         "paymentTypeId": "b5693615-59fa-44af-a97a-fa57508f5567",
#                         "paymentAdditionalData": {
#                             "type": "IikoCard",
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
#                         "isProcessedExternally": False,
#                         "paymentTypeId": "09322f46-578a-d210-add7-eec222a08871",
#                         "paymentAdditionalData": {
#                             "type": "При получении",
#                             "credential": phone,
#                             "searchScope": "Phone"
#                         }
#                     }
#                 ]
#             if token:
#                 requests.post("https://api-ru.iiko.services/api/1/deliveries/create?Timeout=50",
#                               json={
#                                   "organizationId": order[4],
#                                   "terminalGroupId": terminal_group_id,
#                                   "priceCategories": {
#                                       "name": "1"
#                                   },
#                                   "order": {
#                                       "items": json.loads(order[5]),
#                                       "payments": payments,
#                                       "orderTypeId": "5b1508f9-fe5b-d6af-cb8d-043af587d5c2",
#                                       "phone": phone,
#                                       "comment": "не готовить!  тест чат бота"
#                                   }
#                               },
#                               headers={"Authorization": "Bearer " + token})
#             if order[3] and order[3] > 0:
#                 requests.post("https://api-ru.iiko.services/api/1/deliveries/create?Timeout=50",
#                               json={
#                                   "organizationId": order[4],
#                                   "terminalGroupId": terminal_group_id,
#                                   "order": {
#                                       "items": json.loads(order[5]),
#                                       "payments": payments,
#                                       "orderTypeId": "5b1508f9-fe5b-d6af-cb8d-043af587d5c2",
#                                       "phone": phone,
#                                       "comment": "не готовить!  тест чат бота",
#                                   }
#                               },
#                               headers={"Authorization": "Bearer " + token})
#     else:
#         return None


# async def check_is_auth_handler(request: Request):
#     bot: Bot = request.app["bot"]

#     data = await request.post()
#     user = db.get_or_create_user(data['userId'])
#     if check_webapp_signature(bot.token, data["_auth"]) and data['userId']:
#         return json_response({"ok": True, "isAuth": user[3] == 1})
#     return json_response({"ok": False, "err": "Unauthorized", "isAuth": False}, status=401)



import json
from pathlib import Path
import hashlib
import logging
import requests
# from aiohttp import web
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
    return FileResponse(Path(__file__).parent.resolve() / "static/main.html")


def get_token():
    logger.info("Fetching token from iiko services")
    res = requests.post("https://api-ru.iiko.services/api/1/access_token", json={"apiLogin": "de902294-a56"})
    if res and res.text:
        json_res = json.loads(res.text)
        if json_res["token"]:
            token = json_res["token"]
            logger.info("Token fetched successfully")
            return token
    logger.error("Failed to fetch token")
    return ''


def update_or_create_dots():
    logger.info("Updating or creating dots in the database")
    db.update_or_create_dot(get_token())
    return True


async def get_dots_handler(request: Request):
    logger.info("Handling get_dots request")
    bot: Bot = request.app["bot"]

    data = await request.post()
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

    data = await request.post()
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
    data = await request.post()
    user = db.get_or_create_user(data['userId'])
    
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
                "organizationId": data["selectedPoint"]
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
                                             "organizationId": data["selectedPoint"],
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
    logger.info("Handling get_menu request")
    bot: Bot = request.app["bot"]

    data = await request.post()
    if check_webapp_signature(bot.token, data["_auth"]):
        if data:
            if data["selectedPoint"]:
                token = get_token()
                if token:
                    res_menu = requests.post("https://api-ru.iiko.services/api/1/nomenclature",
                                             json={"organizationId": data["selectedPoint"]},
                                             headers={"Authorization": "Bearer " + token})
                    if res_menu and res_menu.text:
                        json_res_menu = json.loads(res_menu.text)
                        if json_res_menu["products"]:
                            products = []
                            for product in json_res_menu["products"]:
                                modifiers = []
                                modifiers_array = []
                                if product["type"] == "Dish":
                                    for modifier in product["groupModifiers"]:
                                        for product_for_modifier in json_res_menu["products"]:
                                            if product_for_modifier["groupId"] == modifier["id"] and \
                                                    product_for_modifier["id"] not in modifiers_array:
                                                modifiers.append({
                                                    "id": product_for_modifier["id"],
                                                    "name": product_for_modifier["name"],
                                                    "price": product_for_modifier["sizePrices"][0]["price"][
                                                        "currentPrice"]
                                                })
                                                modifiers_array.append(product_for_modifier["id"])

                                    if 'L' not in product['name']: # Если это не шаурма(так как фотка стоит только от шавы)
                                        continue

                                    products.append({
                                        "id": product["id"],
                                        "name": product["name"],
                                        "price": product["sizePrices"][0]["price"]["currentPrice"],
                                        "modifiers": modifiers
                                    })

                            clear_products = []
                            for product in products:
                                is_exits = False
                                for clear_product in clear_products:
                                    size_data = []
                                    if clear_product["name"] == product["name"].split(" ")[0]:
                                        is_exits = True
                                        clear_product["sizes"].append({
                                            "name": product["name"].split(" ")[1],
                                            "price": product["price"],
                                            "id": product["id"],
                                        })
                                        size_data.append(product["name"].split(" ")[1])
                                if not is_exits:
                                    clear_products.append({
                                        "id": product["id"],
                                        "name": product["name"].split(" ")[0],
                                        "modifiers": product["modifiers"],
                                        "sizes": [
                                            {
                                                "id": product["id"],
                                                "name": product["name"].split(" ")[1],
                                                "price": product["price"],
                                            }
                                        ]
                                    })

                            logger.info("Menu data retrieved successfully")
                            return json_response({"ok": True, "products": clear_products})
        logger.warning("Unauthorized access attempt or no data")
        return json_response({"ok": False})
    logger.warning("Unauthorized access attempt")
    return json_response({"ok": False, "err": "Unauthorized"}, status=401)


async def create_order_handler(request: Request):
    logger.info("Handling create_order request")
    bot: Bot = request.app["bot"]

    data = await request.post()
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
                for add in el["additional"]:
                    modifiers += '{"productId": "' + add["elId"] + '","amount": 1},'
                    description += " + " + add["name"]
                modifiers = modifiers[:-1]
                description += ", "
                items += '{"type": "Product","productId": "' + el["sizeId"] + '","amount": 1,"  ": ' + str(
                    el["price"]) + ',"name": "' + el["name"] + '","size": "' + el["size"] + '","modifiers": [' + modifiers + ']},'
            items = items[:-1]
            items = '[' + items + ']'

            description = description[:-2]

            points = 0
            if data['points'] and data['points'] != '0':
                p = int(data['points'])
                if p and p > 0:
                    points = p
                    sum -= p

            pickup_time = data['pickup_time']
            payment_method = data['payment_method']
            oder_id = db.create_order(user[0], sum, points, data['selectedPoint'], items, False, pickup_time,
                                      payment_method)

            if payment_method == 'after':
                await create_order_on_dot(order_id=oder_id, pickup_time=pickup_time)

            logger.info(f"Order created successfully with ID: {oder_id}")
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
                                     "organizationIds": [organization_id],
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


# async def create_order_on_dot(order_id):
#     logger.info(f"Creating order on dot for order ID: {order_id}")
#     order_id = int(order_id)
    
#     if isinstance(order_id, int) and order_id > 0:
#         order = db.get_order(order_id)

#         user = db.get_user_by_id(int(order[1]))
#         if user:
#             phone = user[2]
#             if phone.startswith('7') or phone.startswith('8'):
#                 phone = '+7' + phone[1:]

#             token = get_token()
#             terminal_group_id = get_terminal_group_id(order[4], token)
#             if order[8] == 'online':
#                 payments = [
#                     {
#                         "paymentTypeKind": "IikoCard",
#                         "sum": "1",
#                         "isProcessedExternally": False,
#                         "paymentTypeId": "b5693615-59fa-44af-a97a-fa57508f5567",
#                         "paymentAdditionalData": {
#                             "type": "IikoCard",
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
#                         "isProcessedExternally": False,
#                         "paymentTypeId": "09322f46-578a-d210-add7-eec222a08871",
#                         "paymentAdditionalData": {
#                             "type": "При получении",
#                             "credential": phone,
#                             "searchScope": "Phone"
#                         }
#                     }
#                 ]
#             if token:
#                 requests.post("https://api-ru.iiko.services/api/1/deliveries/create?Timeout=50",
#                               json={
#                                   "organizationId": order[4],
#                                   "terminalGroupId": terminal_group_id,
#                                   "priceCategories": {
#                                       "name": "1"
#                                   },
#                                   "order": {
#                                       "items": json.loads(order[5]),
#                                       "payments": payments,
#                                       "orderTypeId": "5b1508f9-fe5b-d6af-cb8d-043af587d5c2",
#                                       "phone": phone,
#                                       "comment": "не готовить!  тест чат бота, заказ №"+str(order_id)
#                                   }
#                               },
#                               headers={"Authorization": "Bearer " + token})
#             if order[3] and order[3] > 0:
#                 requests.post("https://api-ru.iiko.services/api/1/deliveries/create?Timeout=50",
#                               json={
#                                   "organizationId": order[4],
#                                   "terminalGroupId": terminal_group_id,
#                                   "order": {
#                                       "items": json.loads(order[5]),
#                                       "payments": payments,
#                                       "orderTypeId": "5b1508f9-fe5b-d6af-cb8d-043af587d5c2",
#                                       "phone": phone,
#                                       "comment": "не готовить!  тест чат бота, заказ №"+str(order_id),
#                                   }
#                               },
#                               headers={"Authorization": "Bearer " + token})
#             logger.info(f"Order with ID: {order_id} created on dot successfully")
#     else:
#         logger.error(f"Invalid order ID: {order_id}")
#         return None
async def create_order_on_dot(order_id, pickup_time):
    logger.info(f"Creating order on dot for order ID: {order_id}")
    order_id = int(order_id)
    # Определяем смещение для Томского времени (UTC+7)
    tomsk_offset = timedelta(hours=7)
    tomsk_timezone = timezone(tomsk_offset)

# Получаем текущую дату и время в часовом поясе Томска
    current_date = datetime.now(tomsk_timezone)
    # Парсинг времени
    pickup_time_parsed = datetime.strptime(pickup_time, "%H:%M")

    # Создание новой datetime с текущей датой и временем из pickup_time
    combined_datetime = current_date.replace(hour=pickup_time_parsed.hour, minute=pickup_time_parsed.minute, second=0, microsecond=0)

    # Форматирование в необходимый формат
    formatted_time = combined_datetime.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
    if isinstance(order_id, int) and order_id > 0:
        order = db.get_order(order_id)

        user = db.get_user_by_id(int(order[1]))
        if user:
            phone = user[2]
            if phone.startswith('7') or phone.startswith('8'):
                phone = '+7' + phone[1:]

            token = get_token()
            terminal_group_id = get_terminal_group_id(order[4], token)
            if order[8] == 'online':
                payments = [
                    {
                        "paymentTypeKind": "IikoCard",
                        "sum": "1",
                        "isProcessedExternally": False,
                        "paymentTypeId": "b5693615-59fa-44af-a97a-fa57508f5567",
                        "paymentAdditionalData": {
                            "type": "IikoCard",
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
                        "isProcessedExternally": False,
                        "paymentTypeId": "09322f46-578a-d210-add7-eec222a08871",
                        "paymentAdditionalData": {
                            "type": "При получении",
                            "credential": phone,
                            "searchScope": "Phone"
                        }
                    }
                ]
            if token:
                response = requests.post(
                    "https://api-ru.iiko.services/api/1/deliveries/create?Timeout=50",
                    json={
                        "organizationId": order[4],
                        "terminalGroupId": terminal_group_id,
                        "priceCategories": {
                            "name": "1"
                        },
                        "order": {
                            "externalNumber": str(order_id),
                            "items": json.loads(order[5]),
                            "completeBefore": str(formatted_time),
                            "payments": payments,
                            "orderTypeId": "5b1508f9-fe5b-d6af-cb8d-043af587d5c2",
                            "phone": phone,
                            "comment": "не готовить!  тест чат бота, заказ №" + str(order_id)
                        }
                    },
                    headers={"Authorization": "Bearer " + token}
                )
                if response.status_code == 200:
                    response_data = response.json()
                    external_number = response_data.get('orderInfo', {}).get('externalNumber')
                    logger.info(f"Order with ID: {order_id} created on dot successfully with externalNumber: {external_number}")
                    return external_number
                else:
                    logger.error(f"Failed to create order: {response.status_code} - {response.text}")
                    return None
            if order[3] and order[3] > 0:
                response = requests.post(
                    "https://api-ru.iiko.services/api/1/deliveries/create?Timeout=50",
                    json={
                        "organizationId": order[4],
                        "terminalGroupId": terminal_group_id,
                        "order": {
                            "externalNumber": str(order_id),
                            "completeBefore": str(formatted_time),
                            "items": json.loads(order[5]),
                            "payments": payments,
                            "orderTypeId": "5b1508f9-fe5b-d6af-cb8d-043af587d5c2",
                            "phone": phone,
                            "comment": "не готовить!  тест чат бота, заказ №" + str(order_id),
                        }
                    },
                    headers={"Authorization": "Bearer " + token}
                )
                if response.status_code == 200:
                    response_data = response.json()
                    external_number = response_data.get('orderInfo', {}).get('externalNumber')
                    logger.info(f"Order with ID: {order_id} created on dot successfully with externalNumber: {external_number}")
                    return external_number
                else:
                    logger.error(f"Failed to create order: {response.status_code} - {response.text}")
                    return None
        else:
            logger.error(f"User not found for order ID: {order_id}")
            return None
    else:
        logger.error(f"Invalid order ID: {order_id}")
        return None

async def check_is_auth_handler(request: Request):
    logger.info("Handling check_is_auth request")
    bot: Bot = request.app["bot"]

    data = await request.post()
    user = db.get_or_create_user(data['userId'])
    if check_webapp_signature(bot.token, data["_auth"]) and data['userId']:
        return json_response({"ok": True, "isAuth": user[3] == 1})
    logger.warning("Unauthorized access attempt")
    return json_response({"ok": False, "err": "Unauthorized", "isAuth": False}, status=401)
