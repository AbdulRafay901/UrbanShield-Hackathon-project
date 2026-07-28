


import { WEATHER_API_KEY } from "../config.js";
import { weatherTips, clearSafetyTips } from "../js/safetyTips.js";


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

export const fetchWeatherData = async (lat, lon) => {
    try {
        
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

        const res = await fetch(url);
        const forecastData = await res.json();

        
        const current = forecastData.list[0];

        const temp = current.main.temp;
        const windspeed = Math.round(current.wind.speed);
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

        clearSafetyTips();

        weatherTips(
            name,
            temp,
            humidity,
            windspeed
        );

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