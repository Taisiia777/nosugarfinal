import re

from aiogram import Bot, F, Router
from aiogram.filters import Command
from aiogram.types import (
    MenuButtonWebApp,
    Message,
    WebAppInfo,
)

from db import Database
from sms import generate_and_send_code, send_code

my_router = Router()
db = Database('database.db')


def format_phone_number(phone):
    phone = re.sub(r'\D', '', phone)

    if re.match(r'^7|8\d{10}$', phone):
        phone = '8' + phone[1:]
        return phone
    else:
        return None


@my_router.message(Command("start"))
async def command_start(message: Message, bot: Bot, base_url: str):
    user = db.get_or_create_user(message.from_user.id)

    if not user or len(user) < 4:
        return
    if user[2] and user[3]:
        await message.answer(f"""Добрый день! Вы успешно авторизованы под номером {user[2]}. Приятного заказа!\n
                                Для выхода или смены телефона отправьте /stop""")
        await bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(text="Сделать заказ", web_app=WebAppInfo(url=f"{base_url}"))
        )
    else:
        await message.answer(
            """Добрый день! Мы не нашли вас в нашей базе, пожалуйста, авторизуйтесь.\n
            Для этого отправьте в чат ваш номер телефона в формате 89231231212.""")


@my_router.message(Command("stop"))
async def command_start(message: Message, bot: Bot, base_url: str):
    user = db.get_or_create_user(message.from_user.id)
    db.set_wait_confirm(user[0], False)
    db.set_phone_confirm(user[0], False)
    db.set_phone(user[0], False)
    await message.answer('''Вы успешно вышли!\n Для авторизации отправьте /start''')


@my_router.message(Command("get_code"))
async def command_start(message: Message, bot: Bot, base_url: str):
    user = db.get_or_create_user(message.from_user.id)
    if user[4] and user[5]:
        await send_code(user[2], db.get_code(user[0]))
        await message.answer('''Код подтверждения отправлен!\n
                                Для повторного получения кода отправьте /get_code''')


@my_router.message()
async def message_handler(message: Message, bot: Bot, base_url: str):
    user = db.get_or_create_user(message.from_user.id)

    if user[2] and user[3]:  # Если указан номер телефона и он подстверждён
        await message.answer(f"""Вы успешно авторизованы под номером {user[2]}. Приятного заказа!\n
                                Для выхода или смены телефона отправьте /stop""")
        await bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(text="Сделать заказ", web_app=WebAppInfo(url=f"{base_url}"))
        )
    elif user[4] and user[5]:  # Если код был отправлен и ожидает подтверждения
        if message.text.isdigit() and len(message.text) == 4 and db.get_code(user[0]) == str(message.text):
            db.set_wait_confirm(user[0], False)
            db.set_phone_confirm(user[0], True)
            await message.answer(f"""Вы успешно авторизовались под номером {user[2]}. Приятного заказа!\n
                                Для выхода или смены телефона отправьте /stop""")
            await bot.set_chat_menu_button(
                menu_button=MenuButtonWebApp(text="Сделать заказ", web_app=WebAppInfo(url=f"{base_url}"))
            )
        else:
            await message.answer(f"""Неверный код\n
                                    Для повторного получения кода отправьте /get_code""")
    else:
        formatted_phone = format_phone_number(message.text)
        if formatted_phone:
            db.set_phone(user[0], formatted_phone)
            db.set_code(user[0], await generate_and_send_code(formatted_phone))
            db.set_wait_confirm(user[0], True)
            await message.answer(
                f"""На ваш телефон {formatted_phone} отправлен код подтверждения. Пришлите его в чате.\n
                                    Для повторного получения кода отправьте /get_code""")
        else:
            await message.answer(f"""Введите телефон в формате 89231231212""")
            db.set_wait_confirm(user[0], False)
