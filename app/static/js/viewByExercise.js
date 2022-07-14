let form = document.querySelector("#form");
let div = document.querySelector("#exerciseInfo");
let exerciseTypeSelect = document.querySelector('#type');
let exerciseSelect = document.querySelector('#exercise');
let workouts_data;
let changeExerciseSelect = () => {
    let exercises = workouts_data[exerciseTypeSelect.value];
    exerciseSelect.innerHTML = "";
    for (let e of exercises) {
        let optionElement = document.createElement('option');
        optionElement.appendChild(document.createTextNode(e));
        exerciseSelect.appendChild(optionElement);
    }
    loadExerciseData();
    try {
        document.querySelector('#delthis').remove();
        return null;
    } catch (e) {
        if (e instanceof TypeError) {
            return null;
        }
    }
}

fetch('/get_data').then((r) => {
    r.json().then(data => {
        workouts_data = data;
        exerciseTypeSelect.addEventListener('change', changeExerciseSelect);
        exerciseSelect.addEventListener('change', loadExerciseData);
    });
});



function loadExerciseData() {
    let exercise = exerciseSelect.value;
    class InfoAttr {
        constructor(replaceFunc) {
            this.w = 0;
            this.r = 0;
            this.d = 0;
            this.rm1 = 0;
            this.replaceFunc = replaceFunc; // when should the data be replaced?
        }

        replaceAttrs(w, r, d, rm1) {
            this.w = w;
            this.r = r;
            this.d = d;
            this.rm1 = rm1;
        }
    }
    let onerepmax = (w, r) => Math.floor(w / (1.0278 - 0.0278 * r));

    const info = {
        mostWeight: new InfoAttr((newVal, oldVal) => {
            return (newVal > oldVal);
        }),
        mostReps: new InfoAttr((newVal, oldVal) => {
            return (newVal > oldVal);
        }),
        best1RM: new InfoAttr((newVal, oldVal) => {
            return (newVal > oldVal);
        }),
        setsCount: 0
    }
    for (let [date, workout] of Object.entries(workouts_data['workouts'])) {
        let daysOfTheExercise = Object.entries(workout).filter(exerciseSetsPair => exerciseSetsPair[0] == exercise);
        for (let sets of daysOfTheExercise) {
            // sets = [exercise, sets] weird, i know
            sets = sets[1];

            for (let set of sets) {
                let weight = Number(set[1]);
                let reps = Number(set[0]);
                let rm1 = onerepmax(weight, reps);
                if (info.mostWeight.replaceFunc(weight, info.mostWeight.w)) {
                    info.mostWeight.replaceAttrs(weight, reps, date, rm1);
                }
                if (info.mostReps.replaceFunc(reps, info.mostReps.r)) {
                    info.mostReps.replaceAttrs(weight, reps, date, rm1);
                }
                if (info.best1RM.replaceFunc(rm1, info.best1RM.rm1)) {
                    info.best1RM.replaceAttrs(weight, reps, date, rm1);
                }
                info.setsCount += 1;
            }
        }
    }
    let infoDiv = document.getElementById("exerciseInfo");
    infoDiv.innerHTML = "";
    if (info.setsCount > 2) {
        infoDiv.hidden = false;
        function createElementWithStr(element, text, parentNode) {
            let e = document.createElement(element);
            e.appendChild(document.createTextNode(text));
            parentNode.appendChild(e);
            parentNode.appendChild(document.createElement('hr'));
        }

        createElementWithStr('h3',
            `Most Weight Set: ${info.mostWeight.w} lbs, 
${info.mostWeight.r} reps, 
${info.mostWeight.rm1} one rep max
on ${info.mostWeight.d}`,
            infoDiv);
        createElementWithStr('h3',
            `Most Reps Set: ${info.mostReps.w} lbs, 
${info.mostReps.r} reps, 
${info.mostReps.rm1} one rep max
on ${info.mostReps.d}`,
            infoDiv);
        createElementWithStr('h3',
            `Best 1RM set: ${info.best1RM.w} lbs, 
${info.best1RM.r} reps, 
${info.best1RM.rm1} one rep max
on ${info.best1RM.d}`,
            infoDiv);
        createElementWithStr('h3', `${info.setsCount} sets total`, infoDiv);

    }

}

function get1rm() {
    let weight = parseInt(document.getElementById("weight").value);
    let reps = parseInt(document.getElementById("reps1").value);
    let ans = weight / (1.0278 - 0.0278 * reps);
    document.querySelector("#ans1").value = Math.floor(ans);
}
function getqrm() {
    let rm1 = parseInt(document.getElementById("1rm").value);
    let reps = parseInt(document.getElementById("reps").value);
    let ans = rm1 * (1.0278 - 0.0278 * reps);
    document.querySelector("#ans2").value = Math.floor(ans);
}
document.getElementById('../asi').addEventListener('click', () => {
    loadExerciseData();
});