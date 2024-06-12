import аsyncio

import nest_asyncio
import logging
import ssl
import os
import sys

from аiohttp.web_app import Application
from aiohttp.web_runner import AppRunner, TCPSite

from handlers import my_router
from routes import open_main_handler, get_dots_handler, get_menu_handler, \
    pay_success, create_order_handler, check_is_auth_handler, get_points_handler, update_or_create_dots

from aiogram import Bot, Dispatcher
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application
from aiogram.enums import ParseMode
from aiogram.client.bot import DefaultBotProperties

from config import BOT_TOKEN, APP_BASE_URL, PORT

TOKEN = BOT_TOKEN


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

    app.router.add_get("", open_main_handler)
    app.router.add_get("/", open_main_handler)
    app.router.add_post("/checkIsAuth", check_is_auth_handler)
    app.router.add_post("/getMenu", get_menu_handler)
    app.router.add_post("/createOrder", create_order_handler)
    app.router.add_post("/getDots", get_dots_handler)
    app.router.add_post("/getPoints", get_points_handler)
    app.router.add_post("/paySuccess", pay_success)

    local_dir = os.path.join(os.path.dirname(__file__), "static")
    app.router.add_static('/static', local_dir)

    SimpleRequestHandler(
        dispatcher=dispatcher,
        bot=bot,
    ).register(app, path="/webhook")
    setup_application(app, dispatcher, bot=bot)

    if PORT == 443:
        ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
        ssl_context.load_cert_chain('static/sslCerts/certificate.crt', 'static/sslCerts/private.key')
    else:
        ssl_context = None
    runner = AppRunner(app)
    await runner.sеtup()

    if PORT == 443:
        site = TCPSite(runner, "0.0.0.0", PORT, ssl_context=ssl_context)
    else:
        site = TCPSite(runner, "0.0.0.0", PORT)
    await site.start()
    
    await start_bot(bot, dispatcher)


if __name__ == "__main__":
    nest_asyncio.apply()
    logging.basicConfig(level=logging.WARNING, filename='logs/bezumno-bot-main.log', filemode="a",
                        format="%(asctime)s %(levelname)s %(message)s")
    # Эта строка дублирует вывод логов в терминал
    # logging.getLogger().addHandler(logging.StreamHandler(sys.stdout))
    update_or_create_dots()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
