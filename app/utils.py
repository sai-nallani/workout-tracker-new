import json
import os
from xmlrpc.client import boolean

THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
my_file = os.path.join(THIS_FOLDER, 'workouts.json')


def update_json(data: dict = None, on_creation: bool = False) -> dict or bool:
    if data:
        if (os.path.exists(my_file) and on_creation):
            print("""Oops! Path already exists!""")
            return False # like status code, true good false bad

        with open(my_file, 'w') as file:
            json.dump(obj=data, fp=file)
            return True # like status code, true good false bad
    else:
        with open(my_file, 'r') as file:
            return json.load(file)
