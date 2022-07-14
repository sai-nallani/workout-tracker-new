import json


def update_json(data: dict = None) -> dict:
    if data:
        with open('app/workouts.json', 'w') as file:
            json.dump(obj=data, fp=file)
            return {}
    else:
        with open('app/workouts.json', 'r') as file:
            return json.load(file)
