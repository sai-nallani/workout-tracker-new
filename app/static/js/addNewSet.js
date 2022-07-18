function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        // add other defaults here if necessary
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

let addEForm = document.getElementById('addE')
addEForm.addEventListener('submit', e => {
    e.preventDefault();
    let t = addEForm.elements['t'].value;
    let es = addEForm.elements['newExercise'].value;

    if (confirm('You sure you want to add ' + es + ' to the section of ' + t + '?')) {
        fetch('/add_new_exercise', {
            method: 'POST',
            body: JSON.stringify({ type: t, exercise: es })
        });
        location.reload();
    }
});

fetch('/get_data').then((r) => {
    r.json().then(data => {
        let workouts_data = data;
        // #region vars
        let lastSetCookieName = 'previousSubmission';
        let exercise_type = document.querySelectorAll('.type');
        let exercise = document.querySelector('#exercise');
        let repsAndWeightDiv = document.querySelector('#repsAndWeight')
        let reps = document.querySelector('#reps');
        let weight = document.querySelector('#weight');
        let previousSubmissionJSON = getCookie(lastSetCookieName) ? JSON.parse(getCookie(lastSetCookieName)) : undefined;
        let form = document.querySelector("#form");
        let todaySets = document.querySelector('#todaySets');
        // #endregion
        let URIExercise = s => s.replaceAll(" ", "");

        // #region setTheTypes
        for (let [type, _value] of Object.entries(workouts_data['exercises'])) {
            let typeElement = document.createElement('option');
            typeElement.appendChild(document.createTextNode(type));
            exercise_type[0].appendChild(typeElement.cloneNode(true));
            exercise_type[1].appendChild(typeElement.cloneNode(true));
        }
        //#endregion
        // #region functions
        let returnTodayDate = () => {
            let date = new Date();
            let addZeroIfLessThanTen = (value) => {
                return value < 10 ? '0' + value.toString() : value.toString();
            };
            let dateStr = `${date.getFullYear()}-\
${addZeroIfLessThanTen(date.getMonth() + 1)}-\
${addZeroIfLessThanTen(date.getDate())}`;
            return dateStr;
        };

        let updateTodaySets = () => {
            todaySets.innerHTML = "";
            let e = exercise.value
            let exerciseCookies = getCookie(URIExercise(e));
            if (!exerciseCookies) {
                return null;
            }

            if (returnTodayDate() in workouts_data['workouts']) {
                if (workouts_data['workouts'][returnTodayDate()][exercise.value].length == 0) {
                    setCookie(URIExercise(exercise.value), '', {
                        'max-age': -1
                    });
                }
            } else {
                document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
                return null;
            }
            try {

                let exerciseTS = JSON.parse(exerciseCookies);
                let setsToday = workouts_data['workouts'][returnTodayDate()][e];
                for (let i = exerciseTS.length - 1; i >= 0; i--) {
                    let set = setsToday[i];
                    let exerciseTimestamp = exerciseTS[i];
                    let timeAgo = (new Date().getTime() - exerciseTimestamp) / 1000;
                    let minutes = Math.floor(timeAgo / 60);
                    let seconds = Math.floor(timeAgo % 60);

                    let setElement = document.createElement('p');
                    setElement.appendChild(document.createTextNode(`${minutes}m${seconds}s ago- ${set[0]} reps, ${set[1]} lbs`));
                    todaySets.appendChild(setElement);
                }
            } catch (e) {
                if (e instanceof TypeError) {
                    // console.log(e);     
                    return null; // exercise not in today's cookie, makes sense.
                } else if (e instanceof SyntaxError) {
                    // console.log(e);
                    return null; // cookienotfound
                }
            }
        }
        let changeExerciseSelect = () => {
            reps.style.display = "block";
            exercise_type[1].value = exercise_type[0].value;
            exercise.innerHTML = "";
            let exercises = workouts_data['exercises'][exercise_type[0].value];
            for (let e of exercises) {
                let optionElement = document.createElement('option');
                optionElement.appendChild(document.createTextNode(e));
                exercise.appendChild(optionElement);
            }
            updateTodaySets();
            repsAndWeightDiv.style.display = "block";
        }
        // #region clear cookies if exercise is deleted
        // #endregion
        exercise_type[0].addEventListener('change', changeExerciseSelect);
        exercise.addEventListener('change', updateTodaySets);

        // #region cookie handling
        if (previousSubmissionJSON) {
            exercise_type[0].value = previousSubmissionJSON['exerciseType'];
            reps.value = previousSubmissionJSON['reps'];
            weight.value = previousSubmissionJSON['weight'];
            changeExerciseSelect();
            exercise.value = previousSubmissionJSON['exercise'];
            updateTodaySets();
            setInterval(updateTodaySets, 1000 / 1);
            document.querySelector('#delthis').remove();
        } else {
            repsAndWeightDiv.style.display = "none";
        }
        // #endregion


        form.addEventListener('submit', e => {
            e.preventDefault();
            setCookie(lastSetCookieName, "", {
                'max-age': -1
            });
            let addZeroIfLessThanTen = (value) => {
                return value < 10 ? '0' + value.toString() : value.toString();
            };
            let date = new Date();
            let dateStr = `${date.getFullYear()}-${addZeroIfLessThanTen(date.getMonth() + 1)}-${addZeroIfLessThanTen(date.getDate())}`;

            let formJSON = {
                exerciseType: form.elements['type'].value,
                exercise: form.elements['exercise'].value,
                reps: form.elements['reps'].value,
                weight: form.elements['weight'].value,
                datetime: new Date().getTime(),
                date: dateStr
            };

            // console.log(formJSON);
            setCookie(lastSetCookieName, JSON.stringify(formJSON));

            let ex = formJSON.exercise;
            // #region timestamp exercise
            let exerciseTimestamps = getCookie(URIExercise(ex));
            let expireDate = new Date();
            expireDate.setHours(24);
            expireDate.setMinutes(0);
            expireDate.setSeconds(0);
            if (exerciseTimestamps) {
                let newTimestamps = JSON.parse(exerciseTimestamps);
                newTimestamps.push(formJSON.datetime);
                setCookie(URIExercise(ex),
                    JSON.stringify(newTimestamps),
                    {
                        'expires': expireDate
                    });
            } else {
                setCookie(URIExercise(ex),
                    JSON.stringify([formJSON.datetime]),
                    {
                        'expires': expireDate
                    });

            }
            // #endregion

            fetch('/add_new_set', {
                method: 'POST',
                body: JSON.stringify(formJSON),

            }).then(_res => {
                if (_res.ok) {
                    location.reload();
                } else {
                    console.error("POST REQUEST NOT OK");
                }
            });

        });

    });
});

