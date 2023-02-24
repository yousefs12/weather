"use strict"

let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

// Reaching HTML Elements
let search = document.querySelector("#search");
let day = document.querySelectorAll(".day");
let currentTemp = document.querySelector("#currentTemp");
let condition = document.querySelectorAll(".condition");
let wind = document.querySelectorAll(".wind");
let maxTemp = document.querySelectorAll(".maxTemp");
let minTemp = document.querySelectorAll(".minTemp");

// Declaring Varibales
let q = "cairo";
let position = {};
let current = {};
let forecast = [];

// Using Date Object
let d = new Date();
day[0].innerHTML = days[d.getDay()];
// Ternary Condition
day[1].innerHTML = days[(d.getDay() + 1 < days.length)? 
    d.getDay() + 1 : d.getDay() + 1 - days.length];
day[2].innerHTML = days[(d.getDay() + 2 < days.length)?
    d.getDay() + 2 : d.getDay() + 2 - days.length];
day[0].nextElementSibling.innerHTML = d.getDate() + months[d.getMonth()];

// Interacting With The API
async function apiReq(q) {
    const apiRespone = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=%200583f387bab14be6a02154310232202&q=${q}&days=3&aqi=no&alerts=no`);
    const finalResult = await apiRespone.json();

    if (finalResult.error) return;

    position = finalResult.location;
    current = finalResult.current;
    forecast = finalResult.forecast.forecastday;

    displayLocation();
    displayTemp();
    displayImgs();
    displayCondition();
    displayWind();
}

// Invoking The API Request Function
apiReq(q);
search.addEventListener("input", () => {
    if (search.value.length == 3){
        apiReq(search.value);
    }
});

// Displaying Data Functions
function displayLocation() {
    currentTemp.previousElementSibling.innerHTML = position.name;
}

function displayTemp() {
    // Current Day Temperature
    currentTemp.innerHTML = current.temp_c + "<sup>o</sup>C";

    // Next Days Temperature
    for (let i = 0; i < maxTemp.length; i++) {
        maxTemp[i].innerHTML = forecast[i + 1].day.maxtemp_c + "<sup>o</sup>C";
    }

    for (let i = 0; i < minTemp.length; i++) {
        minTemp[i].innerHTML = forecast[i + 1].day.mintemp_c + "<sup>o</sup>C";
    }
}

function displayImgs() {
    // Current Day Image
    currentTemp.nextElementSibling.src = `${current.condition.icon}`;

    // Next Days Images
    for (let i = 0; i < maxTemp.length; i++) {
        maxTemp[i].previousElementSibling.src = `${forecast[i + 1].day.condition.icon}`
    }
}

function displayCondition() {
    // Current Day Condition
    currentTemp.nextElementSibling.nextElementSibling.innerHTML = `${current.condition.text}`;

    // Next Days Conditions
    for (let i = 0; i < maxTemp.length; i++) {
        maxTemp[i].nextElementSibling.nextElementSibling.innerHTML = `${forecast[i + 1].day.condition.text}`
    }
}

function displayWind() {
    wind[0].innerHTML = '<i class="fa fa-umbrella me-1"></i>' + forecast[0].day.daily_will_it_rain + '%';
    wind[1].innerHTML = '<i class="fa fa-wind me-1"></i>' + current.wind_kph + 'km/h';
    wind[2].innerHTML = '<i class="fa fa-directions me-1"></i>' + current.wind_dir;
}