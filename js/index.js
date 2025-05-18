// player state
let state = "home";
let stateComplete = true;

// bars
let healthBar = document.querySelector('#healthbar');
let mentalBar = document.querySelector('#mentalbar');

let activityList = document.querySelector(".activityList")
let activityTooltip = document.querySelector("#activity-tooltip")
let sprite = document.querySelector('#sprite');

let personInfo = {"physical": 100, "mental": 100, "currentActivity": ""};

const dayText = document.getElementById("day");
const timeText = document.getElementById("time");

// time rules (in minutes, 0-1440)
let time = 0; // in minutes
let day = 0;
let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// "[action]": [physical, mental, time taken (minutes), tooltip]
let info = {
    "Exercise": [10, 5, 45, "Exercise boosts your health and mood."],
    "Eat Junk Food": [-5, 5, 15, "Tastes good, but hurts your physical health."],
    "Sleep": [20, 30, 480, "Restores your body and mind."],
    "Eat Vegetables": [5, 0, 10, "Nutritious and helps your health over time."],
    "Watch YouTube": [-5, 10, 30, "Fun, but too much can drain you physically."],
    "Listen to Music": [0, 10, 20, "Great for relaxing and boosting mental health."],
    "Stay up late": [-15, -5, 120, "Less rest means poorer health and mood."],
    "Go to school": [-10, 5, 420, "Mentally enriching, but physically tiring."],
    "Do homework": [-5, 10, 120, "Helps learning, but costs energy."],
    "Do chores": [-2, -2, 30, "Necessary but not enjoyable."],
    "Wake Up": [0, 0, 0, "Time to start your day!"],
}

function sleepActions() {
    for (let i = 0; i < activityList.childNodes.length; i++) {
        if (activityList.childNodes[i].classList && activityList.childNodes[i].classList.contains("sleep")) {
            activityList.childNodes[i].disabled = false;
        } else {
            activityList.childNodes[i].disabled = true;
        }
    }
}

function schoolActions() {
    for (let i = 0; i < activityList.childNodes.length; i++) {
        if (activityList.childNodes[i].classList && activityList.childNodes[i].classList.contains("school")) {
            activityList.childNodes[i].disabled = false;
        } else {
            activityList.childNodes[i].disabled = true;
        }
    }
}

function homeActions() {
    for (let i = 0; i < activityList.childNodes.length; i++) {
        if (activityList.childNodes[i].classList && activityList.childNodes[i].classList.contains("home")) {
            activityList.childNodes[i].disabled = false;
        } else {
            activityList.childNodes[i].disabled = true;
        }
    }
}

function runState() {
    switch (state) {
        case "sleep":
            sleepActions();
            break;
        case "school":
            schoolActions();
            break;
        case "home":
            homeActions();
            break;
        default:
            break;
    }
}

function updateTime(timePassed) {
    time += timePassed;
    if (time >= 1440) {
        time = time - 1440;
        day++;
        if (day > 6) {
            day = 0;// game should end, just a placeholder for now
        }
    }

    dayText.innerText = "Day: " + days[day];

    
    let hours = Math.floor(time / 60);
    let minutes = time % 60;
    let period = "AM";
    if (hours >= 12) {
        period = "PM";
    }
    
    if (hours > 12) {
        hours -= 12
    }

    if (hours == 0) {
        hours = 12;
    }

    
    if (hours < 10 && minutes < 10) {
        timeText.innerText = "Time: " + hours + ":0" + minutes + " " + period;
    }
    else if (hours < 10) {
        timeText.innerText = "Time: 0" + hours + ":" + minutes + " " + period;
    }
    else if (minutes < 10) {
        timeText.innerText = "Time: " + hours + ":0" + minutes + " " + period;
    }
    else {
        timeText.innerText = "Time: " + hours + ":" + minutes + " " + period;
    }
}


function clampStats() {
    if (personInfo.physical > 100) {
        personInfo.physical = 100;
    }
    else if (personInfo.physical < 0) {
        personInfo.physical = 0;
    }

    if (personInfo.mental > 100) {
        personInfo.mental = 100;
    }
    else if (personInfo.mental < 0) {
        personInfo.mental = 0;
    }
}

function setBarPercent(bar, percent) {
    bar.style.transition = 'width 0.5s ease-in-out';
    bar.style.width = percent + '%';
    bar.innerText = percent + '%';
}


// add activity button functions
activityList.childNodes.forEach((node, index) => {
    if (node.classList) {
        node.addEventListener('click', (e) => {
            if (personInfo.mental == 0 || personInfo.physical == 0) {
                location.reload();
            }
            personInfo.mental += info[node.textContent][1]
            personInfo.physical += info[node.textContent][0]
            personInfo.currentActivity = node.textContent
            activityTooltip.textContent = info[node.textContent][3]
            
            // set state
            switch (node.textContent) {
                case "Sleep":
                    state = "sleep";
                    break;
                case "Go to school":
                    state = "school";
                    break;
                case "Go Home":
                    state = "home";                  
                    break;
                case "Wake Up":
                    state = "home";
                    break;
            }
            
            
            updateTime(info[node.textContent][2]);
            clampStats();
            runState();

            console.log(personInfo, state);
        })
    }
})


document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener("click", (btn) => {
        setBarPercent(mentalBar, personInfo.mental)
        setBarPercent(healthBar, personInfo.physical)
    })
})

function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}