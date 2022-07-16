import json
from app.utils import update_json

exercises: dict = {'Push': [], 'Pull': [], 'Legs': [], 'Other': [], 'workouts': {}}

if not update_json(data=exercises, on_creation=True):
    exit()

numOfPush = input("""How many "push" exercises do you want to add?: """)
for _ in range(int(numOfPush)):
    exercises['Push'].append(input("Exercise: "))

numOfPull = input("""How many "pull" exercises do you want to add?: """)
for _ in range(int(numOfPull)):
    exercises['Pull'].append(input("Exercise: "))

numOfLegs = input("""How many "leg" exercises do you want to add?: """)
for _ in range(int(numOfLegs)):
    exercises['Legs'].append(input("Exercise: "))

numOfOther = input("""How many "other" exercises do you want to add?: """)
for _ in range(int(numOfOther)):
    exercises['Other'].append(input("Exercise: "))

update_json(data=exercises)