import sqlite3
import requests
import json


class Database:
    def __init__(self, db_file):
        self.connection = sqlite3.connect(db_file)
        self.cur = self.connection.cursor()

        self.cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        phone TEXT,
        phone_confirm BOOL,
        code TEXT,
        wait_confirm BOOL,
        dot_id INTEGER,
        citi_id INTEGER
        )
        ''')

        self.cur.execute('''
        CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        summ INTEGER,
        points INTEGER,
        dot TEXT,
        order_content TEXT,
        paid BOOL,
        pickup_time TEXT,
        payment_metod TEXT
        )
        ''')

        self.cur.execute('''
        CREATE TABLE IF NOT EXISTS dots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        responseType TEXT,
        id_dot TEXT,
        name TEXT,
        code TEXT,
        pickup_start TEXT,
        pickup_end TEXT
        )
        ''')

    def create_order(self, user_id, summ, points, dot, order_content, paid, pickup_time, payment_method):
        with self.connection:
            self.cur.execute(
                "INSERT INTO `orders` (`user_id`, `summ`, `points`, `dot`, `order_content`, `paid`, `pickup_time`, `payment_method`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (str(user_id), summ, points, str(dot), str(order_content), paid, str(pickup_time), str(payment_method)))
            self.connection.commit()
            object_id = self.cur.lastrowid

            return object_id

    def get_order(self, order_id):
        with self.connection:
            result = self.connection.execute("SELECT * FROM `orders` WHERE `id` = ?", (order_id,)).fetchall()
        return result[0]

    def add_user(self, user_id):
        with self.connection:
            result = self.cur.execute("INSERT into `users` (`user_id`) VALUES (?)", (str(user_id),))
            self.connection.commit()
            return result

    def get_user(self, user_id):
        with self.connection:
            result = self.connection.execute("SELECT * FROM `users` WHERE `user_id` = ?", (user_id,)).fetchall()
        return result

    def set_phone(self, id, phone):
        with self.connection:
            result = self.cur.execute("UPDATE `users` SET `phone` = ? WHERE `id` = ?", (phone, id))
            self.connection.commit()

    def set_wait_confirm(self, id, wait_confirm):
        with self.connection:
            self.cur.execute("UPDATE `users` SET `wait_confirm` = ? WHERE `id` = ?", (wait_confirm, id))
            self.connection.commit()

    def set_phone_confirm(self, id, phone_confirm):
        with self.connection:
            self.cur.execute("UPDATE `users` SET `phone_confirm` = ? WHERE `id` = ?", (phone_confirm, id))
            self.connection.commit()

    def set_code(self, id, code):
        with self.connection:
            result = self.cur.execute("Update `users` set `code` = ? WHERE `id` = ?", (code, id))
            self.connection.commit()
        return result

    def get_code(self, user_id):
        with self.connection:
            result = self.connection.execute("SELECT * FROM `users` WHERE `id` = ?", (user_id,)).fetchall()
        try:
            return result[0][4]
        except IndexError:
            return None

    def get_user_by_id(self, user_id):
        with self.connection:
            result = self.connection.execute("SELECT * FROM `users` WHERE `id` = ?", (user_id,)).fetchall()
        try:
            return result[0]
        except IndexError:
            return None

    def get_or_create_user(self, user_id):
        with self.connection:
            result = self.connection.execute("SELECT * FROM `users` WHERE `user_id` = ?", (user_id,)).fetchall()
        if bool(len(result)):
            return result[0]
        else:
            self.add_user(user_id)
            return self.get_user(user_id)

    def get_dots(self):
        with self.connection:
            result = self.connection.execute("SELECT * FROM `dots`").fetchall()
            return result

    def get_dot(self, id_dot):
        with self.connection:
            result = self.connection.execute("SELECT * FROM `dots` WHERE `id_dot` = ?", (id_dot,)).fetchone()
            return result

    def update_or_create_dot(self, token):
        if token != '':
            res_dots = requests.post("https://api-ru.iiko.services/api/1/organizations", json={"apiLogin": "1d664d00"},
                                     headers={"Authorization": "Bearer " + token})
            if res_dots and res_dots.text:
                json_res_dots = json.loads(res_dots.text)
                if json_res_dots["organizations"]:
                    for line in json_res_dots["organizations"]:
                        with self.connection:
                            result = self.connection.execute("SELECT * FROM `dots` WHERE `id_dot` = ?",
                                                             (line['id'],)).fetchall()
                        if bool(len(result)):
                            self.cur.execute("UPDATE `dots` SET `name` = ? WHERE `id_dot` = ?",
                                             (line['name'], line['id']))
                            self.connection.commit()
                        else:
                            self.cur.execute(
                                "INSERT into `dots` (`responseType`, `id_dot`, `name`, `code`) VALUES (?, ?, ?, ?)",
                                (str(line['responseType']), str(line['id']), str(line['name']), str(line['code'])))
                            self.connection.commit()

    def get_orders_by_user(self, user_id):
        with self.connection:
            result = self.connection.execute("SELECT * FROM `orders` WHERE `user_id` = ?", (user_id,)).fetchall()
        return result
    