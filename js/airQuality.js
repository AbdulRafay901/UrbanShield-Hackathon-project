

import { WEATHER_API_KEY } from "../config.js";
import { GEMINI_API_KEY } from "../config.js";
import { airTips } from "../js/safetyTips.js";
import { updateAirScore } from "../components/sidebar.js";



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


export const fetchAirData = async (lat, lon) => {

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


     airTips(aqi);
     updateAirScore(aqi);

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
    
        let aiLine = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
       

    } catch (error) {
        console.error("AI Error:", error);
        if (textElem) {
            textElem.textContent = getFallbackSuggestion(aqiLevel);
        }
    }
}

// Ai Suggestion For Air Qualtity ----------------- End