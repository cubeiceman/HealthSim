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
    "Exercise": [5, 5, 60, "Exercise is good for your physical and mental health!"],
    "Eat Junk Food": [-10, 10, 15, "Eating junk food may feel good, but it hurts you more than you think."],
    "Sleep": [50, 50, 480, "Sleeping provide a huge energy boost"],
    "Eat Vegetables": [10, -5, 5, "Eating vegetables may not taste as good as junk food but it helps you a lot."],
    "Watch YouTube" : [0, 5, 30, "Watching Youtube elevates your mood"],
    "Listen to Music": [0, 5, 15, "Listening to music is a great way to relax."],
    "Stay up late": [-10, 0, 60, "Staying up late to do homework will hurt your health."],
    "Go to school": [-10, 0, 480, "Going to school helps you stay on top of your schoolwork."],
    "Do homework": [0, -10, 120, "Doing homework helps you understand the material better."],
    "Do chores": [-5, -5, 30, "Doing chores keeps a clean mind"]
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

    dayText.innerHTML = "Day: " + days[day];

    
    let hours = Math.floor(time / 60);
    let minutes = time % 60;
    let period = "AM";
    if (hours >= 12) {
        period = "PM";
    }
    
    if (hours > 12) {
        hours -= 12
    }

    
    if (hours < 10 && minutes < 10) {
        timeText.innerHTML = "Time: " + hours + ":0" + minutes + " " + period;
    }
    else if (hours < 10) {
        timeText.innerHTML = "Time: 0" + hours + ":" + minutes + " " + period;
    }
    else if (minutes < 10) {
        timeText.innerHTML = "Time: " + hours + ":0" + minutes + " " + period;
    }
    else {
        timeText.innerHTML = "Time: " + hours + ":" + minutes + " " + period;
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
            activityTooltip.textContent = info[node.textContent][3]
            updateTime(info[node.textContent][2]);
            clampStats();
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