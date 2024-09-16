import random
import requests


async def generate_and_send_code(phone):
    code = random.randint(1000, 9999)
    requests.get(
        f"""https://gateway.api.sc/get/?user=79313764122&pwd=)MxU6jaq]l&sadr=NoSugar&dadr={phone}&text=Код авторизации для Чат-Бота Nosugar. : {code}""")
    return code


async def send_code(phone, code):
    requests.get(
        f"""https://gateway.api.sc/get/?user=79313764122&pwd=)MxU6jaq]l&sadr=NoSugar&dadr={phone}&text=Код авторизации для Чат-Бота Nosugar. : {code}""")
