import { WEATHER_API_KEY } from "../config.js";

// DOM Elements
const locationNameEl = document.getElementById("aqiLocationName");
const dateStrEl = document.getElementById("aqiDateStr");

const heroCardEl = document.getElementById("aqiHeroCard");
const mainValEl = document.getElementById("aqiMainVal");
const statusTitleEl = document.getElementById("aqiStatusTitle");
const statusDescEl = document.getElementById("aqiStatusDesc");

const pm25El = document.getElementById("valPM25");
const pm10El = document.getElementById("valPM10");
const o3El = document.getElementById("valO3");
const coEl = document.getElementById("valCO");
const no2El = document.getElementById("valNO2");
const so2El = document.getElementById("valSO2");

const adviceTextEl = document.getElementById("aqiAdviceText");

// Format Date String for Header
function formatHeaderDate() {
    const now = new Date();
    const options = { day: 'numeric', month: 'short' };
    return `Today, ${now.toLocaleDateString('en-US', options)}`;
}

// AQI Status Configs based on OpenWeather 1-5 scale
const AQI_LEVELS = {
    1: {
        title: "Good",
        class: "level-good",
        color: "#10B981",
        desc: "Air quality is satisfactory and poses little or no risk.",
        advice: "Air quality is satisfactory and poses little or no risk. Great time for outdoor activities!"
    },
    2: {
        title: "Fair",
        class: "level-fair",
        color: "#3B82F6",
        desc: "Air quality is acceptable for most people.",
        advice: "Air quality is acceptable; however, sensitive individuals should monitor symptoms."
    },
    3: {
        title: "Moderate",
        class: "level-moderate",
        color: "#F59E0B",
        desc: "Air quality is acceptable. Sensitive groups may experience mild effects.",
        advice: "Air quality is satisfactory for most, but sensitive groups should limit prolonged outdoor exertion."
    },
    4: {
        title: "Poor",
        class: "level-poor",
        color: "#EF4444",
        desc: "Unhealthy air quality. Consider wearing a protective mask outdoors.",
        advice: "Unhealthy air quality. Consider wearing a protective mask outdoors and close windows."
    },
    5: {
        title: "Very Poor",
        class: "level-hazardous",
        color: "#7C3AED",
        desc: "Hazardous air conditions! Stay indoors and use air purifiers.",
        advice: "Hazardous air conditions! Wear a mask outdoors, avoid strenuous activities, and keep air purifiers on."
    }
};

window.addEventListener("DOMContentLoaded", () => {
    if (dateStrEl) dateStrEl.textContent = formatHeaderDate();
    getUserLocation();
});

// Location detection
const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Geocode city name
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
                    const data = await res.json();
                    const city = data.address.city || data.address.town || data.address.state || "Location";
                    const country = data.address.country || "";
                    if (locationNameEl) locationNameEl.textContent = `${city}, ${country}`;
                } catch (e) {
                    console.log("Geocoding fallback", e);
                }

                fetchAirPollutionData(lat, lon);
            },
            (error) => {
                console.warn("Geolocation warning:", error.message);
                fetchLocationByIP();
            },
            { timeout: 6000 }
        );
    } else {
        fetchLocationByIP();
    }
};

const fetchLocationByIP = async () => {
    try {
        const res = await fetch("https://api.ipapi.is/");
        const data = await res.json();
        if (locationNameEl) locationNameEl.textContent = `${data.city}, ${data.country || data.regionName}`;
        fetchAirPollutionData(data.location.latitude, data.location.longitude);
    } catch (err) {
        console.error("IP Location Fallback Error:", err);
        // Default to Hyderabad coordinates
        fetchAirPollutionData(25.3960, 68.3578);
    }
};

// Fetch Air Pollution API Data
async function fetchAirPollutionData(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.list || !data.list.length) return;

        const aqiIndex = data.list[0].main.aqi || 2;
        const components = data.list[0].components || {};

        // Calculate numeric US AQI estimate based on PM2.5 or PM10 for display
        const pm25Val = Math.round(components.pm2_5 || 15);
        const pm10Val = Math.round(components.pm10 || 30);
        const o3Val = Math.round(components.o3 || 45);
        const coVal = ((components.co || 400) / 1000).toFixed(1);
        const no2Val = Math.round(components.no2 || 18);
        const so2Val = Math.round(components.so2 || 12);

        // Estimate realistic US AQI score for display (e.g. 54)
        let displayAQI = Math.round(pm25Val * 2.2 + 10);
        if (aqiIndex === 1 && displayAQI > 50) displayAQI = 35;
        if (aqiIndex === 2 && (displayAQI < 51 || displayAQI > 100)) displayAQI = 54;
        if (aqiIndex === 3 && (displayAQI < 101 || displayAQI > 150)) displayAQI = 118;
        if (aqiIndex >= 4 && displayAQI < 151) displayAQI = 168;

        // Render Hero Card
        const levelConfig = AQI_LEVELS[aqiIndex] || AQI_LEVELS[3];

        if (mainValEl) mainValEl.textContent = displayAQI;
        if (statusTitleEl) {
            statusTitleEl.textContent = levelConfig.title;
            statusTitleEl.style.color = levelConfig.color;
        }
        if (statusDescEl) statusDescEl.textContent = levelConfig.desc;
        if (heroCardEl) {
            heroCardEl.className = `aqi-hero-card ${levelConfig.class}`;
        }

        // Render Pollutants Grid
        if (pm25El) pm25El.textContent = pm25Val;
        if (pm10El) pm10El.textContent = pm10Val;
        if (o3El) o3El.textContent = o3Val;
        if (coEl) coEl.textContent = coVal;
        if (no2El) no2El.textContent = no2Val;
        if (so2El) so2El.textContent = so2Val;

        // Render Health Advice
        if (adviceTextEl) adviceTextEl.textContent = levelConfig.advice;

    } catch (error) {
        console.error("Error fetching air pollution data:", error);
    }
}
