import json
import os

THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
my_file = os.path.join(THIS_FOLDER, 'workouts.json')

def update_json(data: dict = None) -> dict:
    if data:
        with open(my_file, 'w') as file:
            json.dump(obj=data, fp=file)
            return {}
    else:
        with open(my_file, 'r') as file:
            return json.load(file)
