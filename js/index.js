// player state
let state = "home";

let timeSlots = {
    "home": [0, 1440, 0, 0],
    "school": [480, 960, 0, -1],
    "sleep": [0, 420, -1, -1]
}

// main
let mainDiv = document.body;

// speech
let speech = new SpeechSynthesisUtterance();
speech.rate = 0.8; // Speed of speech
speech.pitch = 1.2; // Pitch of speech
speech.volume = 0.9; // Volume of speech

let voices = window.speechSynthesis.getVoices();
speech.voice = voices[0];

// bars
let healthBar = document.querySelector('#physicalbar');
let mentalBar = document.querySelector('#mentalbar');


let activityList = document.querySelector("#activityList")

let personInfo = {"physical": 100, "mental": 100, "currentActivity": ""};

const dayText = document.getElementById("day");
const timeText = document.getElementById("time");

// time rules (in minutes, 0-1440)
let time = 0; // in minutes
let day = 0;
let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// "[action]": [physical, mental, time taken (minutes), tooltip]
let info = {
    "Exercise": [12, 8, 45, "Boosts your energy and mood significantly."],
    "Eat Junk Food": [-3, 3, 15, "A quick treat, but can slowly impact your physical health."],
    "Sleep": [25, 35, 60, "Crucial for recovery and mental clarity."],
    "Eat Vegetables": [7, 2, 10, "Nourishes your body for long-term well-being."],
    "Watch YouTube": [-2, 7, 30, "Entertaining, but can be a time sink and slightly tiring."],
    "Listen to Music": [1, 12, 20, "Uplifting and great for your mental state."],
    "Stay up late": [-10, -3, 120, "Reduces your physical and mental reserves."],
    "Go to school": [-7, 8, 30, "Academically stimulating but can be draining."],
    "Do homework": [-3, 7, 120, "Important for learning and can be mentally engaging."],
    "Do chores": [-1, -1, 30, "Small tasks that need to be done."],
    "Wake Up": [0, 0, 0, "The start of a new day."],
    "Go home": [-3, -3, 30, "The journey back can be tiring."]
}

function consequencesBAM() {
    for (let i = 0; i < Object.keys(timeSlots).length; i++) {
        let key = Object.keys(timeSlots)[i];
        if (state != key && time >= timeSlots[key][0] && time <= timeSlots[key][1]) {
            personInfo.physical += timeSlots[key][2];
            personInfo.mental += timeSlots[key][3];
        }
    }
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
    } else if (hours == 0) {
        hours = 12
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
            personInfo.mental += info[node.textContent][1];
            personInfo.physical += info[node.textContent][0];
            personInfo.currentActivity = node.textContent;
            updateTime(info[node.textContent][2]);
            
            // set state
            switch (node.textContent) {
                case "Sleep":
                    state = "sleep";
                    break;
                case "Go to school":
                    state = "school";
                    break;
                case "Go home":
                    state = "home";                  
                    break;
                case "Wake Up":
                    state = "home";
                    break;
            }
            
            
            
            clampStats();
            runState();


        })
    }
})


function incrementMinutes() {
    updateTime(1);
    clampStats();
    runState();
    consequencesBAM();
    setBarPercent(mentalBar, personInfo.mental);
    setBarPercent(healthBar, personInfo.physical);
    if (personInfo.mental == 0 || personInfo.physical == 0) {
        alert("You lost!!!!!!! Bob is gone :(");
        location.reload();
    }
    console.log(state)
}

document.addEventListener('DOMContentLoaded', () => {
    // speech.text = "Hello! I'm Bob";
    // window.speechSynthesis.speak(speech);
    // speech.text = "Help me learn how to live a healthy life!"
    // window.speechSynthesis.speak(speech);

    document.addEventListener("click", (btn) => {
        setBarPercent(mentalBar, personInfo.mental);
        setBarPercent(healthBar, personInfo.physical);
    })
})

function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function shake(time = 500) {
    mainDiv.style.animationPlayState = "running";
    setTimeout(() => {
        mainDiv.style.animationPlayState = "paused";
    }, time);
}

setInterval(incrementMinutes, 500);