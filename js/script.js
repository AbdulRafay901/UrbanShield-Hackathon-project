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
    weather_img: document.querySelector(".weather-img")
};


const fetchWeatherData = async (lat, lon) => {

    try {

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

        const res = await fetch(url)

        const data = await res.json();

        console.log(data)

        const temp = data.main.temp;
        const windspeed = data.wind.speed;
        const name = data.weather[0].main;
        const feels_like = data.main.feels_like;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const visiblity = (data.visibility / 1000).toFixed(1);

        switch(name){
            case "Clear":
                elements.weather_img.src = "assets/sun.png";
            break;
            case "Clouds":
                elements.weather_img.src = "assets/cloudy.png"    
            break;
            case "PartlyCloudy":
                elements.weather_img.src = "assets/cloudy-sun.png"    
            break;
            case "Rain":
                elements.weather_img.src = "assets/rainy-day.png"    
            break;
            case "Drizzle":
                elements.weather_img.src = "assets/rainy-day.png"    
            break;
            case "Thunderstorm":
                elements.weather_img.src = "assets/thunderstorm.png"    
            break;
            case "Snow":
                elements.weather_img.src = "assets/snowy.png"    
            break;
            case "Haze":
            case "Mist":
            case "Fog":
            case "Smoke":       
                elements.weather_img.src = "assets/cloud.png"    
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

        console.log(error)

    }
}



const fetchAirData = async (lat, lon) => {

    const element = {
        aqi: document.querySelector(".aqi"),
        air_level: document.querySelector(".air-level"),
        air_circle: document.querySelector(".air-circle")
    }

    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`


    const res = await fetch(url)
    const data = await res.json()

    const aqi = element.aqi.textContent = data.list[0].main.aqi;
    const pm25 = data.list[0].components.pm2_5;

    getShortAISuggestion(aqi, pm25, lat, lon)

    console.log(pm25)


    switch (aqi) {
        case 1:
            element.air_level.innerHTML = "Good"
            element.air_level.classList.add("air-level-1")
            element.air_circle.classList.add("air-circle-1")
            break;
        case 2:
            element.air_level.innerHTML = "Fair"
            element.air_level.classList.add("air-level-2")
            element.air_circle.classList.add("air-circle-2")
            break;
        case 3:
            element.air_level.innerHTML = "Moderate"
            element.air_level.classList.add("air-level-3")
            element.air_circle.classList.add("air-circle-3")
            break;
        case 4:
            element.air_level.innerHTML = "Poor"
            element.air_level.classList.add("air-level-4")
            element.air_circle.classList.add("air-circle-4")
            break;
        case 5:
             element.air_level.innerHTML = "Very Poor"
            element.air_level.classList.add("air-level-5")
            element.air_circle.classList.add("air-circle-5")
            break;

    }


}


// Ai Suggestion For Air Qualtity ----------------- Start

async function getShortAISuggestion(aqiLevel, pm25, lat, lon) {
    const textElem = document.querySelector(".AirQuality-Ai");
        
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
    
        let aiLine = data.candidates[0].content.parts[0].text.trim();
        
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

const uvValueElem = document.querySelector(".uv-value"); 
const uvStatusElem = document.querySelector(".uv-status"); 
const uvAdviceElem = document.querySelector(".uv-advice"); 
const uvCircle = document.querySelector(".uv-circle");

const fetchUvData = async (lat, lon) => {

     try {

     const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index`;;

     const res = await fetch(apiUrl)
     const data = await res.json()

     const uvIndex = Math.round(data.current.uv_index); 

    if(uvIndex){
         uvValueElem.textContent = uvIndex;
    }

    if (uvIndex <= 2) {
        uvStatusElem.textContent = "Low";
        uvAdviceElem.textContent = "No protection needed. Safe to be outside.";
        uvValueElem.classList.add("air-level-1")
        uvStatusElem.classList.add("air-level-1")
        uvCircle.classList.add("air-circle-1")
    } 
    else if (uvIndex <= 5) {
        statusText = "Moderate";
        adviceText = "Wear sunglasses and use sunscreen.";
        uvValueElem.classList.add("air-level-2")
        uvStatusElem.classList.add("air-level-2")
        uvCircle.classList.add("air-circle-2")
    } 
    else if (uvIndex <= 7) {
        statusText = "High";
        adviceText = "Use sunscreen & wear sunglasses."; 
        uvValueElem.classList.add("air-level-3")
        uvStatusElem.classList.add("air-level-3")
        uvCircle.classList.add("air-circle-3")

    } 
    else if (uvIndex <= 10) {
        statusText = "Very High";
        adviceText = "Minimize sun exposure. Wear protective clothing.";
        uvValueElem.classList.add("air-level-4")
        uvStatusElem.classList.add("air-level-4")
        uvCircle.classList.add("air-circle-4")

    } 
    else {
        statusText = "Extreme";
        adviceText = "Avoid being outside. Stay in the shade!";
        uvValueElem.classList.add("air-level-5")
        uvStatusElem.classList.add("air-level-5")
        uvCircle.classList.add("air-circle-5")
    }

        
     } catch (error) {
        console.log(error)
     }
}

// UV Api -------------------- End
