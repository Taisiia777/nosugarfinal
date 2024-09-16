import asyncio

import nest_asyncio
import logging
import ssl
import os
import sys

import aiohttp_cors
from aiohttp.web_app import Application
from aiohttp.web_runner import AppRunner, TCPSite

from handlers import my_router
from routes import open_main_handler, get_dots_handler, get_menu_handler, \
    pay_success, create_order_handler, check_is_auth_handler, get_points_handler, update_or_create_dots, get_user_phone_number, get_user_phone_info_handler, get_orders_by_user_handler, create_card_handler, login_card_handler, check_tinkoff_payment_status_handler, init_tinkoff_payment_handler

from aiogram import Bot, Dispatcher
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application
from aiogram.enums import ParseMode
from aiogram.client.bot import DefaultBotProperties

from config import BOT_TOKEN, APP_BASE_URL, PORT

TOKEN = BOT_TOKEN
WEB_URL = "https://nosugar.shop"  # URL вашего React приложения

async def open_main_handler(request):
    return web.HTTPFound(location=WEB_URL)

async def start_bot(bot, dispatcher):
    await bot.delete_webhook(drop_pending_updates=True)
    await dispatcher.start_polling(bot)

async def main():
    bot = Bot(TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dispatcher = Dispatcher()
    dispatcher["base_url"] = APP_BASE_URL

    dispatcher.include_router(my_router)

    app = Application()
    app["bot"] = bot

    cors = aiohttp_cors.setup(app, defaults={
        "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
    })

    # Add routes
    cors.add(app.router.add_get("", open_main_handler))
    cors.add(app.router.add_get("/", open_main_handler))
    cors.add(app.router.add_post("/checkIsAuth", check_is_auth_handler))
    cors.add(app.router.add_post("/getMenu", get_menu_handler))
    cors.add(app.router.add_post("/createOrder", create_order_handler))
    cors.add(app.router.add_post("/getDots", get_dots_handler))
    cors.add(app.router.add_post("/getPoints", get_points_handler))
    cors.add(app.router.add_post("/paySuccess", pay_success))
    cors.add(app.router.add_post("/getPhone", get_user_phone_number))
    cors.add(app.router.add_post("/getUserBonus", get_user_phone_info_handler))
    cors.add(app.router.add_post("/get_orders_by_user", get_orders_by_user_handler))
    cors.add(app.router.add_post("/create_card", create_card_handler))
    cors.add(app.router.add_post("/login_card", login_card_handler))
    cors.add(app.router.add_post("/checkTinkoffPaymentStatus", check_tinkoff_payment_status_handler))
    cors.add(app.router.add_post("/initTinkoffPayment", init_tinkoff_payment_handler))

    local_dir = os.path.join(os.path.dirname(__file__), "static/nosugar/build")
    cors.add(app.router.add_static('/static', local_dir))

    SimpleRequestHandler(
        dispatcher=dispatcher,
        bot=bot,
    ).register(app, path="/webhook")
    setup_application(app, dispatcher, bot=bot)

    runner = AppRunner(app)
    await runner.setup()

    site = TCPSite(runner, "0.0.0.0", 8000)  # Ensure your backend runs on port 8000
    await site.start()

    await start_bot(bot, dispatcher)

if __name__ == "__main__":
    logging.basicConfig(level=logging.WARNING, filename='logs/bezumno-bot-main.log', filemode="a",
                        format="%(asctime)s %(levelname)s %(message)s")
    update_or_create_dots()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())