from typing import List
from flask import Blueprint, jsonify, url_for, flash, render_template, request, redirect
from datetime import datetime
from app.utils import update_json
import os
import json
from datetime import datetime
import random

THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
my_file = os.path.join(THIS_FOLDER, 'website/workouts.json')

views: Blueprint = Blueprint('views', __name__)

data: dict = update_json()


@views.route('/get_data')
def get_data():
    return update_json(), 200


@views.route('/')
def index():
    data = update_json()
    workouts: list = list(data['workouts'].keys())[::-1]
    print("asdfasdf", workouts)
    return render_template('index.html', workouts=workouts)


@views.route('/view_date', methods=['GET'])
def view_date():
    date: str = request.args['date']
    data: dict = update_json()
    try:
        new_data = data['workouts'][date]
        return render_template('view_date.html', data=new_data, date=date)
    except KeyError:
        return redirect(url_for('views.index', a=random.randint(1,100)))


@views.route('/add_new_set', methods=['GET', 'POST'])
def add_new_set():
    if request.method == 'POST':
        post_data: dict = json.loads(request.data)
        timestamp = post_data['datetime']
        datetimeObj: datetime = datetime.fromtimestamp(timestamp/1000)
        date: str = str(datetimeObj.date())
        exercise: str = post_data['exercise']
        reps: int = int(post_data['reps'])
        weight: int = int(post_data['weight'])

        if date in data['workouts']:
            if exercise in data["workouts"][date]:
                data["workouts"][date][exercise].append([reps, weight])
            elif exercise not in data["workouts"][date]:
                data["workouts"][date][exercise] = [[reps, weight]]
        else:
            data["workouts"][date] = {exercise: [[reps, weight]]}
        update_json(data)
        return jsonify({})
    return render_template('add_new_set.html')


@views.route('/view_by_exercise')
def view_by_exercise():
    try:
        exercise_type = request.args['type']
        exercise = request.args['exercise']
        return render_template('view_by_exercise_.html', et=exercise_type, e=exercise, fromAddSet=True)
    except KeyError:
        return render_template('view_by_exercise_.html', fromAddSet=False)


@views.route('/add_exercise')
def add_exercise():
    return render_template('add_exercise.html')


@views.route('/delete_set', methods=['POST'])
def delete_set():
    data = update_json()
    date, e, i = str(request.data)[2:-1].split(',')
    del data['workouts'][date][e][int(i)]
    print(data['workouts'][date][e])
    if len(data['workouts'][date][e]) == 0:
        del data['workouts'][date][e]
    del_date = True
    for i in data['workouts'][date]:
        if i != "Type" and len(data['workouts'][date][i]) != 0:
            del_date = False
    if del_date:
        del data['workouts'][date]
    update_json(data)
    return jsonify({})
