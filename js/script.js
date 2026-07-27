// Api Keys 

import { WEATHER_API_KEY } from "../config.js";
import { AIR_API_KEY } from "../config.js";
import { GEMINI_API_KEY } from "../config.js";

// Api Keys 


const ctx = document.getElementById('premiumChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM', '12 AM'],
        datasets: [
            {
                data: [65, 60, 75, 85, 80, 70, 65],
                borderColor: '#F59E0B',
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: '#141D34',
                pointBorderColor: '#F59E0B',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                data: [40, 38, 45, 40, 42, 45, 40],
                borderColor: '#2563EB',
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: '#141D34',
                pointBorderColor: '#2563EB',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                data: [20, 22, 20, 28, 25, 22, 20],
                borderColor: '#10B981',
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: '#141D34',
                pointBorderColor: '#10B981',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }, 
        scales: {
            x: {
                grid: { display: false, drawBorder: false },
                ticks: { color: '#9BA8C8', font: { family: 'Inter', size: 11 } }
            },
            y: {
                grid: { color: 'rgba(36, 47, 74, 0.4)', drawBorder: false },
                ticks: {
                    color: '#9BA8C8',
                    font: { family: 'Inter', size: 11 },
                    stepSize: 25,
                    min: 0,
                    max: 100
                }
            }
        }
    }
});



let location_name = document.querySelector(".location-name");

window.onload = function () {
    getUserLocation();
};

const getUserLocation = async () => {
  
    if (navigator.geolocation) {

    
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(

            function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                

                fetchWeatherData(lat, lon);
                fetchAirData(lat, lon)
                fetchUvData(lat,lon)

            },


            function (error) {
                console.warn("Location denied or error:", error.message);
                console.log("Switching to Fallback IP Location...");

                fetchLocationByIP();
            },
            options
        );
    } else {
        console.error("Browser Not support geolocation");
        fetchLocationByIP();
    }
}


const fetchLocationByIP = async () => {
    try {
    
        const res = await fetch('http://ip-api.com/json/');
        

        const data = await res.json();
        
        location_name.textContent = `${data.city}, ${data.regionName}`
        
        const lat = data.lat;
        const lon = data.lon;

        
        fetchWeatherData(lat, lon);
        fetchAirData(lat, lon);
        fetchUvData(lat, lon);

    } catch (err) {
        
        console.error("IP Location Fail:", err);
    }
}



// Weather Api ------------------- Start


const elements = {
    temp: document.querySelector(".display-3"),
    wind: document.querySelector(".windspeed"),
    name: document.querySelector(".name"),
    feels: document.querySelector(".feels-like"),
    humidity: document.querySelector(".humidity"),
    pressure: document.querySelector(".pressure"),
    visibility: document.querySelector(".visiblity"),
    weather_img: document.querySelector(".weather-img"),

// Mini Cards Elements ------------ Start
    mini_icon: document.querySelector(".weather-mini-card div p"),
    mini_title: document.querySelector(".weather-mini-card div span"),
    mini_expected: document.querySelector(".weather-mini-card div .text-muted"),
    mini_description: document.querySelector(".weather-mini-card .mb-0"),   
// Mini Cards Elements ------------ End
};


const fetchWeatherData = async (lat, lon) => {
    try {
        // Sirf Forecast endpoint call kar rahe hain
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

        const res = await fetch(url);
        const forecastData = await res.json();

        // list[0] me current time ka live data hota hai
        const current = forecastData.list[0];

        const temp = current.main.temp;
        const windspeed = current.wind.speed;
        const name = current.weather[0].main;
        const feels_like = current.main.feels_like;
        const humidity = current.main.humidity;
        const pressure = current.main.pressure;
        const visiblity = (current.visibility / 1000).toFixed(1);  

        // Mini Cards Elements ------------ Start

        const { mini_icon, mini_title, mini_expected, mini_description } = elements;
            
        // Mini Cards Elements ------------ End

        const pop = current.pop || 0;
        const rainChance = Math.round(pop * 100);

        if (rainChance >= 40) {
            mini_icon.textContent = "☔";
            mini_title.textContent = "Rain";
            mini_expected.textContent = "Expected";
            mini_description.textContent = `Rain chance is ${rainChance}%. Carry an umbrella!`;
        } else if (temp >= 38) {
            mini_icon.textContent = "🔥";
            mini_title.textContent = "Heat";
            mini_expected.textContent = "Alert";
            mini_description.textContent = `High temperature (${Math.round(temp)}°C). Drink water!`;
        } else if (temp <= 15) {
            mini_icon.textContent = "🧥";
            mini_title.textContent = "Cold";
            mini_expected.textContent = "Alert";
            mini_description.textContent = `Chilly weather (${Math.round(temp)}°C). Wear a jacket!`;
        } else {
            mini_icon.textContent = "🌤️";
            mini_title.textContent = "Clear";
            mini_expected.textContent = "Weather";
            mini_description.textContent = "Weather is pleasant and clear today.";
        }

        switch(name){
            case "Clear":
                elements.weather_img.src = "assets/sun.png";
            break;
            case "Clouds":
                elements.weather_img.src = "assets/cloudy.png";
            break;
            case "PartlyCloudy":
                elements.weather_img.src = "assets/cloudy-sun.png";
            break;
            case "Rain":
                elements.weather_img.src = "assets/rainy-day.png";
            break;
            case "Drizzle":
                elements.weather_img.src = "assets/rainy-day.png";
            break;
            case "Thunderstorm":
                elements.weather_img.src = "assets/thunderstorm.png";
            break;
            case "Snow":
                elements.weather_img.src = "assets/snowy.png";
            break;
            case "Haze":
            case "Mist":
            case "Fog":
            case "Smoke":       
                elements.weather_img.src = "assets/cloud.png";
            break;
        }

        elements.temp.innerHTML = `${temp}<sup style="font-size:37px; margin:0 3px;">°C</sup>`;
        elements.wind.innerHTML = `${windspeed} <span style="font-size:12px;">km/h</span>`;
        elements.name.textContent = name;
        elements.feels.textContent = `Feels like ${feels_like}°C`;
        elements.humidity.textContent = `${humidity}%`;
        elements.pressure.innerHTML = `${pressure} <span style="font-size:12px;">hPa</span>`;
        elements.visibility.innerHTML = `${visiblity} <span style="font-size:12px;">km</span>`;

    } catch (error) {
        console.log(error);
    }
}



const fetchAirData = async (lat, lon) => {

    const element = {
        aqi: document.querySelector(".aqi"),
        air_level: document.querySelector(".air-level"),
        air_circle: document.querySelector(".air-circle"),
        air_card: document.querySelector(".air-card"),

        // Mini Alert Card Elements
        mini_icon: document.querySelector("#airAlertIcon"),
        mini_title: document.querySelector("#airAlertTitle"),
        mini_desc: document.querySelector("#airAlertDesc")
    };

    try {
        const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        const aqi = data.list[0].main.aqi;
        if (element.aqi) element.aqi.textContent = aqi;

        const pm25 = data.list[0].components.pm2_5;

        getShortAISuggestion(aqi, pm25, lat, lon);

        switch (aqi) {
    case 1:
        element.air_level.innerHTML = "Good";
        element.air_level.classList.add("air-level-1");
        element.air_circle.classList.add("air-circle-1");
        element.air_card.classList.add("air-card-1");

        if (element.mini_title) element.mini_title.textContent = "Air Quality (Good)";
        if (element.mini_desc) element.mini_desc.textContent = "Air is fresh & clean today.";
        if (element.mini_icon) element.mini_icon.className = "ri-leaf-fill text-success";
        break;

    case 2:
        element.air_level.innerHTML = "Fair";
        element.air_level.classList.add("air-level-2");
        element.air_circle.classList.add("air-circle-2");
        element.air_card.classList.add("air-card-2");

        if (element.mini_title) element.mini_title.textContent = "Air Quality (Fair)";
        if (element.mini_desc) element.mini_desc.textContent = "Air quality is acceptable today.";
        if (element.mini_icon) element.mini_icon.className = "ri-windy-fill text-info"; // Fixed
        break;

    case 3:
        element.air_level.innerHTML = "Moderate";
        element.air_level.classList.add("air-level-3");
        element.air_circle.classList.add("air-circle-3");
        element.air_card.classList.add("air-card-3");

        if (element.mini_title) element.mini_title.textContent = "Air Quality (Moderate)";
        if (element.mini_desc) element.mini_desc.textContent = "AQI is moderate today.";
        if (element.mini_icon) element.mini_icon.className = "ri-haze-line "; // Fixed
        break;

    case 4:
        element.air_level.innerHTML = "Poor";
        element.air_level.classList.add("air-level-4");
        element.air_circle.classList.add("air-circle-4");
        element.air_card.classList.add("air-card-4");

        if (element.mini_title) element.mini_title.textContent = "Air Quality (Poor)";
        if (element.mini_desc) element.mini_desc.textContent = "Unhealthy air. Consider wearing a mask.";
        if (element.mini_icon) element.mini_icon.className = "ri-surgical-mask-line text-danger"; // Fixed
        break;

    case 5:
        element.air_level.innerHTML = "Very Poor";
        element.air_level.classList.add("air-level-5");
        element.air_circle.classList.add("air-circle-5");
        element.air_card.classList.add("air-card-5");

        if (element.mini_title) element.mini_title.textContent = "Air Quality (Hazardous)";
        if (element.mini_desc) element.mini_desc.textContent = "Hazardous air! Wear a mask & avoid outdoors.";
        if (element.mini_icon) element.mini_icon.className = "ri-error-warning-fill text-danger";
        break;
}

    } catch (error) {
        console.log(error);
    }
};


// Ai Suggestion For Air Qualtity ----------------- Start

async function getShortAISuggestion(aqiLevel, pm25, lat, lon) {
    const textElem = document.querySelector(".AirQuality-Ai");

    function getFallbackSuggestion(level) {
        switch (Number(level)) {
            case 1:
                return "Fresh air, enjoy outdoor activities.";
            case 2:
                return "Air is acceptable for most people.";
            case 3:
                return "Sensitive people should limit outdoor time.";
            case 4:
                return "Wear a mask and avoid outdoor activities.";
            case 5:
                return "Stay indoors, hazardous air conditions.";
            default:
                return "Check local air quality updates.";
        }
    }
        
    const prompt = `
    You are an AI for an app called Urban Shield. 
    Location Coordinates: Latitude ${lat}, Longitude ${lon}.
    Current AQI Level (1-5): ${aqiLevel}. 
    PM2.5: ${pm25} µg/m³.
    
    Write EXACTLY ONE short sentence of health advice for the user based on this air quality. 
    Maximum length: 5 to 8 words. 
    Examples: "Good air quality for most people." or "Hazardous air, wear a mask today!"
    Do not mention the coordinates in the response. Just the single short sentence.
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (!response.ok || !data.candidates) {
            throw new Error(data.error?.message || "Google API response Error");
        }
    
        let aiLine =
            data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

       
        if (!aiLine) {
            aiLine = getFallbackSuggestion(aqiLevel);
        }

        textElem.textContent = aiLine;

        

    } catch (error) {
        console.error("AI Error:", error);
        if (textElem) {
            textElem.textContent = "Check local air guidelines."; 
        }
    }
}


// Ai Suggestion For Air Qualtity ----------------- End


// UV Api -------------------- Start

// DOM Elements Selection
const uvValueElem = document.querySelector(".uv-value"); 
const uvStatusElem = document.querySelector(".uv-status"); 
const uvAdviceElem = document.querySelector(".uv-advice"); 
const uvCircle = document.querySelector(".uv-circle");
const uvCard = document.querySelector(".UV-card");

// Mini Alert Box Elements
const uvAlertIcon = document.querySelector("#uvAlertIcon");
const uvAlertTitle = document.querySelector("#uvAlertTitle");
const uvAlertDesc = document.querySelector("#uvAlertDesc");

const fetchUvData = async (lat, lon) => {
    try {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        const uvIndex = Math.round(data.current.uv_index); 

        let statusText = "";
        let adviceText = ""; 
        let miniTip = "";    
        let iconClass = "";
        let level = 1;

        if (uvIndex <= 2) {
            statusText = "Low";
            adviceText = "Minimal risk. Safe to enjoy the outdoors without protection.";
            miniTip = "No protection needed";
            iconClass = "ri-sun-line";
            level = 1;
        } 
        else if (uvIndex <= 5) {
            statusText = "Moderate";
            adviceText = "Wear sunglasses and apply SPF 30+ sunscreen if outdoors.";
            miniTip = "Wear sunscreen & shades";
            iconClass = "ri-sun-cloudy-line";
            level = 2;
        } 
        else if (uvIndex <= 7) {
            statusText = "High";
            adviceText = "Cover up! Wear a wide-brim hat, sunglasses & sunscreen."; 
            miniTip = "Use SPF 30+ & wear hat";
            iconClass = "ri-sun-fill";
            level = 3;
        } 
        else if (uvIndex <= 10) {
            statusText = "Very High";
            adviceText = "Avoid direct sun from 10 AM to 4 PM. Use SPF 50+.";
            miniTip = "Avoid direct peak sun";
            iconClass = "ri-alarm-warning-fill";
            level = 4;
        } 
        else {
            statusText = "Extreme";
            adviceText = "Danger! Stay indoors. Unprotected skin can burn in minutes!";
            miniTip = "Danger! Stay indoors";
            iconClass = "ri-fire-fill";
            level = 5;
        }


        if (uvValueElem) uvValueElem.textContent = uvIndex;
        if (uvStatusElem) uvStatusElem.textContent = statusText;
        if (uvAdviceElem) uvAdviceElem.textContent = adviceText; 

        if (uvAlertTitle) uvAlertTitle.textContent = `${statusText} UV Alert`;
        if (uvAlertDesc) uvAlertDesc.textContent = miniTip;  
        if (uvAlertIcon) uvAlertIcon.className = `${iconClass} text-danger`;

    } catch (error) {
        console.error("Error fetching UV data:", error);
    }
};

// UV Api -------------------- End
